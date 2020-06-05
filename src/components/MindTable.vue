<template>
  <div>
    <ItemEditor
      :drawer="drawer"
      :index="index"
      :drawerData="formData"
      :articles="tableData"
      @cancelDrawer="cancelDrawer"
      @submitDrawer="submitDrawer"
    >
    </ItemEditor>
    <Row>
      <Button
        @click="openDrawer(-1)"
        type="primary"
        style="margin-left: 20px; margin-bottom: 10px ">
        创建文献
      </Button>
      <Button
        @click="jumpToStatistics"
        type="primary"
        style="margin-left: 10px; margin-bottom: 10px; float: right; margin-right: 30px">
        查看文献统计
      </Button>
    </Row>
    <Row>
      <Button
        @click="openBibTexModal"
        type="success"
        style="margin-left: 20px; margin-bottom: 10px ">
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
        style="margin-left : 10px; margin-bottom: 10px; float: right; margin-right: 30px">
        删除勾选项
      </Button>
    </Row>
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
      <p class="text-wrapper">{{BibTexExportContent}}</p>
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
          :page-size="page.size"
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
import router from '../router';

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
        alias: '',
        url: '',
        author: '',
        journal: '',
        pages: 0,
        read_state: 'U',
        volume: 0,
        years: 0,
        article_references: [],
      },
      page: {
        current: 1,
        size: 10,
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
          title: '文献名',
          key: 'alias',
          // width: 400,
        },
        {
          title: '第一作者',
          key: 'firstAuthor',
          width: 180,
        },
        {
          title: '阅读状态',
          key: 'status',
          align: 'center',
          width: 105,
          render: (h, params) => {
            // eslint-disable-next-line no-nested-ternary
            const type = (params.row.read_state === 'U' ? 'error' :
              (params.row.read_state === 'I' ? 'primary' : 'success'));
            // eslint-disable-next-line no-nested-ternary
            const text = (params.row.read_state === 'U' ? 'Unread' :
              (params.row.read_state === 'I' ? 'Reading' : 'Read'));
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
          title: '笔记',
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
          title: '选项',
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
                    width: 800,
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
        const authorArr = _.split(article.author, ' and ', 2);
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
          let pageNum;
          if (this.articleTotal === 1) {
            pageNum = 1;
          } else {
            // eslint-disable-next-line no-mixed-operators
            pageNum = _.toInteger((this.page.current - 2) / this.page.size + 1);
          }
          this.$emit('reloadData', pageNum);
          this.page.current = pageNum;
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
        if (this.formData.volume === 0) {
          this.formData.volume = undefined;
        }
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
          drawerFormData.alias,
          drawerFormData.author,
          drawerFormData.url,
          drawerFormData.journal,
          drawerFormData.years,
          drawerFormData.volume,
          drawerFormData.pages,
          drawerFormData.read_state,
          drawerFormData.article_references)
          .then(() => {
            // this.$Message.info('MT data created');
            // window.console.log('page current', this.page.current);
            this.$emit('reloadData', this.page.current);
          })
          .catch((err) => {
            pushErr(this, err, true);
          });
      } else {
        // (id, title, author, url, note, journal, ref)
        changeMTdata(drawerFormData)
          .then(() => {
            // this.$Message.info('MT data change');
            this.$emit('reloadData', this.page.current);
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
          articleJson[i].entryTags.title,
          articleJson[i].entryTags.author,
          articleUrl,
          articleJson[i].entryTags.journal,
          articleJson[i].entryTags.year,
          articleJson[i].entryTags.volume,
          articleJson[i].entryTags.pages,
          'U', [])
          .catch((err) => {
            window.console.error(err);
          }).then(() => {
            this.$emit('reloadData', this.page.current);
          });
      }
      this.$Notice.success({ title: `${articleJson.length}条bib导入成功` });
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
        query: {
          selected: this.data[index].id,
          pageCurrent: this.page.current,
        },
      });
    },
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    deleteSelectItem() {
      let count = 0;
      _.forEach(this.$refs.selection.objData, (article) => {
        // eslint-disable-next-line no-underscore-dangle
        if (article._isChecked === true) {
          count += 1;
          window.console.log('delete article content: ', article);
          deleteMTdata(article.id).then(() => {
            this.$Message.info(`${article.title} Deleted`);
            let pageNum;
            if (this.articleTotal === 1) {
              pageNum = 1;
            } else {
              // eslint-disable-next-line no-mixed-operators
              pageNum = _.toInteger((this.articleTotal - count - 1) / this.page.size + 1);
            }
            this.$emit('reloadData', pageNum);
            this.page.current = pageNum;
          });
        }
      });
    },
    changeReadStatus(index) {
      this.formData = _.clone(this.data[index]);
      if (this.formData.read_state === 'U') {
        this.formData.read_state = 'I';
        this.$Message.info(`${this.formData.title} Reading`);
      } else if (this.formData.read_state === 'I') {
        this.formData.read_state = 'F';
        this.$Message.info(`${this.formData.title} Read`);
      } else {
        this.formData.read_state = 'U';
        this.$Message.info(`${this.formData.title} Unread`);
      }
      changeMTdata(this.formData)
        .then(() => {
          this.$emit('reloadData', this.page.current);
        })
        .catch((err) => {
          pushErr(this, err, true);
        });
    },
    changePage(pageIndex) {
      this.$emit('reloadData', pageIndex);
      this.$Message.success(`Change to Page ${pageIndex}`);
      this.page.current = pageIndex;
    },
    openBibTexExportModal() {
      this.BibTexExportModal = true;
      _.forEach(this.$refs.selection.objData, (article) => {
        let artStr = '';
        // eslint-disable-next-line no-underscore-dangle
        if (article._isChecked === true) {
          artStr = artStr.concat(`@article{,\ntitle={${article.title}},\n`);
          if (article.author !== undefined && article.author !== '') {
            artStr = artStr.concat(`author={${article.author}},\n`);
          }
          if (article.journal !== undefined && article.journal !== '') {
            artStr = artStr.concat(`journal={${article.journal}},\n`);
          }
          if (article.volume !== undefined && article.volume > 0) {
            artStr = artStr.concat(`volume={${article.volume}},\n`);
          }
          if (article.number !== undefined) {
            artStr = artStr.concat(`number={${article.number}},\n`);
          }
          if (article.pages !== undefined && article.pages !== '') {
            artStr = artStr.concat(`pages={${article.pages}},\n`);
          }
          if (article.years !== undefined) {
            artStr = artStr.concat(`year={${article.years}},\n`);
          }
          artStr = artStr.concat('}\n');
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
      this.$copyText(this.BibTexExportContent).then(
        () => {
          this.$Message.info('Copy Success');
          this.BibTexExportModal = false;
          this.BibTexExportContent = '';
        }, () => {
          this.$Message.info('Copy Failed');
          this.BibTexExportModal = false;
          this.BibTexExportContent = '';
        },
      );
    },
    jumpToStatistics() {
      router.push({
        name: 'UserProfile',
        params: {
          content: 'artcSt',
        },
      });
    },
  },
  mounted() {
    if (this.$route.query !== undefined) {
      this.page.current = _.toInteger(this.$route.query.pageCurrent);
    }
    if (this.page.current < 1 || this.page.current === undefined) {
      this.page.current = 1;
    }
  },
};
</script>

<style scoped>
  .text-wrapper {
    white-space: pre-wrap;
  }
</style>
