<template>
  <div>
    <ItemEditor
      v-bind:drawer="drawer"
      v-bind:index="index"
      v-bind:drawerFormData="formData"
      v-bind:articles="tableData"
      @cancelDrawer="cancelDrawer"
      @submitDrawer="submitDrawer"
    >
    </ItemEditor>
    <Button
      @click="openDrawer(-1)"
      type="primary"
      style="margin-left: 10px; margin-bottom: 10px ">
      创建文献
    </Button>
    <Button
      @click="openBibTexModal"
      type="success"
      style="margin-left: 10px; margin-bottom: 10px ">
      导入BibTex
    </Button>
    <Button
      @click="openBibTexExportModal"
      type="success"
      style="margin-left: 10px; margin-bottom: 10px ">
      导出BibTex
    </Button>
    <Button
      @click="deleteSelectItem"
      type="error"
      style="margin-left : 10px; margin-bottom: 10px; float: right; margin-right: 20px">
      删除勾选项
    </Button>
    <Modal
      v-model="BibtexModal"
      title="导入BibTex"
      @on-ok="submitBibModal"
      @on-cancel="cancelBibModal">
      <Input
        v-model="BibValue"
        type="textarea"
        :autosize="{minRows: 6}"
        placeholder="请输入您的BibTex  (支持批量导入) " />
    </Modal>
    <Modal
      v-model="BibTexExportModal"
      title="导出BibTex"
      :styles="{top: '20px'}"
      @on-cancel="cancelBibExportModal">
      <p v-html="BibTexExportContent"></p>
      <p slot="header" style="text-align:center">
        <Icon type="md-checkmark-circle-outline" />
        <span>批量导出成功</span>
      </p>
      <div slot="footer">
        <Button
          type="primary"
          @click="copyBibTex">
          复制BibTex
        </Button>
      </div>
    </Modal>
    <Table row-key="id"
           :columns="columns"
           :data="data"
           border
           ref="selection">
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <Button
        @click="handleSelectAll(true)"
        style="margin-left: 10px; margin-top: 8px;">
        设置全选
      </Button>
      <Button
        @click="handleSelectAll(false)"
        style="margin-left: 10px; margin-top: 8px;">
        取消全选
      </Button>
      <div style="float: right; margin-top: 18px;">
        <Page
          :total="articleTotal"
          :current="page.current"
          :page-size="10"
          show-total
          show-elevator
          @on-change="changePage"
        >
        </Page>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import bibtexParse from 'bibtex-parse-js';
import { pushErr } from '../components/ErrPush';
import ItemEditor from './TableItemEditor';
import MindTableExpand from './MindTableExpand';
import { deleteMTdata, createMTdata, changeMTdata } from '../apis/MindTableEditorApis';

export default {
  name: 'MindTable',
  props: {
    tableData: {
      type: Array,
      required: true,
    },
    articleTotal: {
      type: Number,
      required: true,
    },
  },
  components: { ItemEditor, MindTableExpand },
  data() {
    return {
      drawer: false,
      BibtexModal: false,
      BibTexExportModal: false,
      BibTexExportContent: '',
      index: 0,
      BibValue: '',
      formData: {
        title: '',
        url: '',
        author: '',
        read_state: false,
      },
      page: {
        current: 1,
        // default size: 10,
      },
      columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => h(MindTableExpand, {
            props: {
              row: params.row,
            },
          }),
        },
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: 'Title',
          key: 'title',
          // width: 400,
        },
        {
          title: 'First Author',
          key: 'firstAuthor',
          width: 180,
        },
        {
          title: 'Read State',
          key: 'status',
          align: 'center',
          width: 100,
          render: (h, params) => {
            const type = params.row.read_state === false ? 'error' : 'success';
            const text = params.row.read_state === false ? 'Unread' : 'Read';
            return h('Button', {
              props: {
                type,
                size: 'small',
              },
              on: {
                click: () => {
                  this.changeReadStatus(params.index);
                },
              },
            }, text);
          },
        },
        {
          title: 'Note',
          key: 'note',
          align: 'center',
          render: (h, params) => h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small',
              },
              style: {
                marginRight: '5px',
              },
              on: {
                click: () => {
                  this.editNote(params.index);
                },
              },
            }, '编辑笔记'),
          ]),
          width: 120,
        },
        {
          title: 'Action',
          key: 'action',
          width: 140,
          align: 'center',
          render: (h, params) => h('Dropdown', {
            props: {
              trigger: 'hover',
              transfer: true,
            } }, [
            h('Button', {
              props: {
                size: 'small',
                icon: 'ios-arrow-down',
              },
            }, '更多选项'),
            h('DropdownMenu', { slot: 'list' }, [
              h('DropdownItem', { nativeOn: {
                click: () => {
                  const ref = this.data[params.index].article_references;
                  const refNames = _.map(ref, id =>
                    (_.find(this.data, item => (item.id === id)) || { title: 'notitle' })
                      .title);
                  this.$Modal.info({
                    title: '引用列表',
                    content: `${_.join(refNames, '<br>') || '空'}`,
                  });
                },
              } }, [h('Button', {
                props: {
                  icon: 'md-search',
                  size: 'small',
                  type: 'text',
                } },
              '查看引用'),
              ]),
              h('DropdownItem', { nativeOn: {
                click: () => {
                  this.onView(params.index);
                } },
              }, [h('Button', {
                props: {
                  icon: 'md-document',
                  size: 'small',
                  type: 'text',
                } },
              '编辑文献'),
              ]),
              h('DropdownItem', { nativeOn: {
                click: () => {
                  this.onDelete(params.index);
                } },
              }, [h('Button', {
                props: {
                  icon: 'md-trash',
                  size: 'small',
                  type: 'text',
                } },
              '删除文献'),
              ]),
            ]),
          ]),
        },
      ],
    };
  },
  computed: {
    data() {
      const res = _.slice(this.tableData, 0, this.tableData.length);
      _.forEach(res, (article) => {
        const authorArr = _.split(article.author, 'and', 2);
        _.merge(article, { firstAuthor: authorArr[0] });
        // window.console.log(article);
      });
      return res;
    },
  },
  methods: {
    onView(index) {
      this.$Message.info('Click View');
      this.openDrawer(index);
    },
    onDelete(index) {
      deleteMTdata(this.data[index].id)
        .then(() => {
          this.$Message.info(`${this.data[index].title} Deleted`);
          this.$emit('reloadData');
        });
    },
    openDrawer(index) {
      this.index = index;
      if (this.data[this.index] === undefined) {
        // TODO improve style here
        this.formData = {
          // this is required by iview transfer inside the editor
          article_references: [],
        };
      } else {
        this.formData = _.clone(this.data[this.index]);
      }
      this.drawer = true;
    },
    cancelDrawer() {
      this.$Message.info('cancel drawer');
      this.drawer = false;
    },
    submitDrawer(drawerFormData) {
      this.$Message.info('submit drawer');
      if (this.index === -1) {
        createMTdata(
          drawerFormData.title,
          drawerFormData.author,
          drawerFormData.url,
          drawerFormData.note,
          drawerFormData.journal,
          drawerFormData.article_references)
          .then(() => {
            // this.$Message.info('MT data created');
            this.$emit('reloadData');
          })
          .catch((err) => {
            pushErr(this, err, true);
          });
      } else {
        // (id, title, author, url, note, journal, ref)
        changeMTdata(drawerFormData)
          .then(() => {
            // this.$Message.info('MT data change');
            this.$emit('reloadData');
          })
          .catch((err) => {
            pushErr(this, err, true);
          });
      }
      this.drawer = false;
    },
    openBibTexModal() {
      this.BibtexModal = true;
      this.BibValue = '';
    },
    submitBibModal() {
      const articleJson = bibtexParse.toJSON(this.BibValue);
      for (let i = 0; i < articleJson.length; i += 1) {
        let articleUrl = '';
        if (_.includes(articleJson[i].entryTags.journal, 'arXiv')) {
          articleUrl = articleJson[i].entryTags.journal.split(':')[1];
          articleUrl = `https://arxiv.org/pdf/${articleUrl}.pdf`;
        }
        createMTdata(
          articleJson[i].entryTags.title,
          articleJson[i].entryTags.author,
          articleUrl,
          '',
          articleJson[i].entryTags.journal,
          [])
          .catch((err) => {
            this.$Message.error(`第${i}条BibTex导入失败`);
            window.console.error(err);
          });
      }
      this.$Message.info(`${articleJson.length}条BibTex导入`);
      this.$emit('reloadData');
      this.BibtexModal = false;
      this.BibValue = '';
    },
    cancelBibModal() {
      this.BibtexModal = false;
      this.BibValue = '';
    },
    editNote(index) {
      this.$router.push({
        path: '/articleMde',
        query: { selected: this.data[index].id },
      });
    },
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    deleteSelectItem() {
      _.forEach(this.$refs.selection.objData, (article) => {
        // eslint-disable-next-line no-underscore-dangle
        if (article._isChecked === true) {
          window.console.log('delete article content: ', article);
          deleteMTdata(article.id).then(() => {
            this.$Message.info(`${article.title} Deleted`);
            this.$emit('reloadData');
          });
        }
      });
    },
    changeReadStatus(index) {
      this.formData = _.clone(this.data[index]);
      if (this.formData.read_state === false) {
        this.formData.read_state = true;
        this.$Message.info(`${this.formData.title} Read`);
      } else {
        this.formData.read_state = false;
        this.$Message.info(`${this.formData.title} Unread`);
      }
      changeMTdata(this.formData)
        .then(() => {
          this.$emit('reloadData');
        })
        .catch((err) => {
          pushErr(this, err, true);
        });
    },
    changePage(pageIndex) {
      this.page.current = pageIndex;
      this.$emit('reloadData', this.page.current);
      this.$Message.success(`Change to Page ${pageIndex}`);
    },
    openBibTexExportModal() {
      this.BibTexExportModal = true;
      _.forEach(this.$refs.selection.objData, (article) => {
        let artStr = '';
        // eslint-disable-next-line no-underscore-dangle
        if (article._isChecked === true) {
          artStr = artStr.concat(`@article{,</br>
              title={${article.title}},</br>`);
          if (article.author !== undefined && article.author !== '') {
            artStr = artStr.concat(`author={${article.author}},</br>`);
          }
          if (article.journal !== undefined && article.journal !== '') {
            artStr = artStr.concat(`journal={${article.journal}},</br>`);
          }
          if (article.volume !== undefined && article.volume > 0) {
            artStr = artStr.concat(`volume={${article.volume}},</br>`);
          }
          if (article.number !== undefined) {
            artStr = artStr.concat(`number={${article.number}},</br>`);
          }
          if (article.page !== undefined) {
            artStr = artStr.concat(`pages={${article.page}},</br>`);
          }
          if (article.year !== undefined) {
            artStr = artStr.concat(`year={${article.year}},</br>`);
          }
          // if (article.publisher !== null) {
          //   artStr = artStr.concat(`publisher={${article.publisher}},</br>`);
          // }
          artStr = artStr.concat('}</br>');
          this.BibTexExportContent = this.BibTexExportContent + artStr;
        }
        // window.console.log(`bibtexExport ${this.BibTexExportContent}`);
      });
    },
    cancelBibExportModal() {
      this.BibTexExportModal = false;
      this.BibTexExportContent = '';
    },
    copyBibTex() {
      this.$Message.info('Copy Success');
      this.BibTexExportModal = false;
      this.BibTexExportContent = '';
    },
  },
};
</script>

<style scoped>

</style>
