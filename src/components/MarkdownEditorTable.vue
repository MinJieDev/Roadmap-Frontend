<template>
  <div>
    <Table row-key="id"
           :columns="columns"
           :data="data"
           border
           ref="selection">
    </Table>
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
          width: 100,
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
  },
};
</script>

<style scoped>

</style>
