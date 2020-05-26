<template>
  <div>
    <Button
      @click="createNote"
      type="primary"
      style="margin-left: 10px; margin-bottom: 10px ">
      创建笔记
    </Button>
    <Table row-key="id"
           :columns="columns"
           :data="tableData"
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
          :total="noteTotal"
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
import MDeditorTableExpand from './MDeditorTableExpand';
import ItemEditor from './TableItemEditor';
import { pushErr } from '../components/ErrPush';
import { changeMDnote } from '../apis/MarkdownEditorApis';
// createMDnote, deleleMDnote,

export default {
  name: 'MarkdownEditorTable',
  props: {
    tableData: {
      type: Array,
      required: true,
    },
    noteTotal: {
      type: Number,
      required: true,
    },
  },
  components: { ItemEditor, MDeditorTableExpand },
  data() {
    return {
      noteData: {
        title: '',
        state: false,
        abstract: '',
      },
      page: {
        current: 1,
      },
      columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => h(MDeditorTableExpand, {
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
          title: 'State',
          key: 'status',
          align: 'center',
          width: 125,
          render: (h, params) => {
            const type = params.row.state === false ? 'error' : 'primary';
            const text = params.row.state === false ? 'Unfinished' : 'Finished';
            return h('Button', {
              props: {
                type,
                size: 'small',
              },
              on: {
                click: () => {
                  this.changeNoteStatus(params.index);
                },
              },
            }, text);
          },
        },
        {
          title: 'Action',
          key: 'action',
          width: 355,
          align: 'center',
          render: (h, params) => h('div', [
            h('Button', {
              props: {
                icon: 'md-document',
                size: 'small',
                type: 'text',
              },
              style: {
                marginRight: '5px',
              },
              on: {
                click: () => {
                  this.onView(params.index);
                },
              },
            },
            '查看笔记'),
            h('Button', {
              props: {
                type: 'text',
                size: 'small',
                icon: 'md-create',
              },
              style: {
                marginRight: '5px',
              },
              on: {
                click: () => {
                  this.editNote(params.index);
                },
              },
            },
            '编辑笔记'),
            h('Button', {
              props: {
                icon: 'md-trash',
                size: 'small',
                type: 'text',
              },
              style: {
                marginRight: '5px',
              },
              on: {
                click: () => {
                  this.onDelete(params.index);
                },
              },
            },
            '删除文献'),
          ]),
        },
      ],
    };
  },
  methods: {
    createNote() {
      this.$Message.success('Create note');
      this.$router.push({
        path: '/articleMde',
        query: {
          selected: -1,
          source: 'noteCreate',
          essay: null,
          pageCurrent: this.page.current,
        },
      });
    },
    editNote(index) {
      this.$router.push({
        path: '/articleMde',
        query: {
          selected: this.data[index].id,
          source: 'noteEdit',
          essay: this.noteData,
          pageCurrent: this.page.current,
        },
      });
    },
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    changeNoteStatus(index) {
      window.console.log(this.tableData);
      this.noteData = _.clone(this.tableData[index]);
      if (this.noteData.state === false) {
        this.noteData.state = true;
        this.$Message.info(`${this.noteData.title} Finished`);
      } else {
        this.noteData.state = false;
        this.$Message.info(`${this.noteData.title} Unfinished`);
      }
      changeMDnote(this.noteData)
        .then(() => {
          this.$emit('reloadData', this.page.current);
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
  },
};
</script>

<style scoped>

</style>
