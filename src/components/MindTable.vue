<template>
  <div>
    <ItemEditor
      v-bind:drawer="drawer"
      v-bind:index="index"
      v-bind:drawerFormData="drawerFormData"
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
<!--  TODO: 放置在最右端  -->
    <Button
      @click="deleteSelectItem"
      type="error"
      style="margin-left : 10px; margin-bottom: 10px; ">
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
    <Table row-key="id"
           :columns="columns"
           :data="data"
           border
           ref="selection">
    </Table>
    <Button
      @click="handleSelectAll(true)"
      style="margin-left: 10px; margin-top: 10px ">
      设置全选
    </Button>
    <Button
      @click="handleSelectAll(false)"
      style="margin-left: 10px; margin-top: 10px ">
      取消全选
    </Button>
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
  },
  components: { ItemEditor, MindTableExpand },
  data() {
    return {
      drawer: false,
      BibtexModal: false,
      index: 0,
      BibValue: '',
      drawerFormData: {
        title: '',
        url: '',
        note: '',
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
          // width: 300,
        },
        {
          title: 'First Author',
          key: 'firstAuthor',
          // width: 500,
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
          width: 150,
        },
        {
          title: 'Action',
          key: 'action',
          width: 250,
          align: 'center',
          render: (h, params) => h('div', [
            h('Button', {
              props: {
                type: 'success',
                size: 'small',
              },
              style: {
                marginRight: '5px',
              },
              on: {
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
              },
            }, '查看引用'),
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
                  this.onView(params.index);
                },
              },
            }, '编辑'),
            h('Button', {
              props: {
                type: 'error',
                size: 'small',
              },
              on: {
                click: () => {
                  this.onDelete(params.index);
                },
              },
            }, '删除'),
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
        window.console.log(article);
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
        this.drawerFormData = {
          // this is required by iview transfer inside the editor
          article_references: [],
        };
      } else {
        this.drawerFormData = _.clone(this.data[this.index]);
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
  },
};
</script>

<style scoped>

</style>
