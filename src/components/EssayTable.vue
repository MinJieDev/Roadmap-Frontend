<template>
  <div>
    <Button
      @click="createEssay"
      type="primary"
      style="margin-left: 10px; margin-bottom: 10px ">
      创建笔记
    </Button>
    <Button
      @click="deleteSelectEssay"
      type="error"
      style="margin-left : 10px; margin-bottom: 10px; float: right; margin-right: 20px">
      删除勾选项
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
          :total="essayTotal"
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
import EssayTableExpand from './EssayTableExpand';
import ItemEditor from './TableItemEditor';
import { pushErr } from '../components/ErrPush';
import { changeEssay, deleteEssay } from '../apis/EssayEditorApis';

export default {
  name: 'EssayTable',
  props: {
    tableData: {
      type: Array,
      required: true,
    },
    essayTotal: {
      type: Number,
      required: true,
    },
  },
  components: { ItemEditor, EssayTableExpand },
  data() {
    return {
      noteData: {
        title: '',
        state: false,
        abstract: '',
      },
      page: {
        current: 1,
        size: 10,
      },
      columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => h(EssayTableExpand, {
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
                  this.viewEssay(params.index);
                },
              },
            },
            '查看随笔'),
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
                  this.editEssay(params.index);
                },
              },
            },
            '编辑随笔'),
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
                  this.deleteEssay(params.index);
                },
              },
            },
            '删除随笔'),
          ]),
        },
      ],
    };
  },
  methods: {
    createEssay() {
      this.$Message.success('Create note');
      this.$router.push({
        path: '/essayEditor',
        query: {
          selected: -1,
        },
      });
    },
    viewEssay(index) {
      this.$router.push({
        path: '/essayReader',
        query: {
          selected: this.data[index].id,
        },
      });
    },
    editEssay(index) {
      this.$router.push({
        path: '/essayEditor',
        query: {
          selected: this.tableData[index].id,
        },
      });
    },
    deleteEssay(index) {
      deleteEssay(this.tableData[index].id).then(() => {
        // eslint-disable-next-line no-mixed-operators
        this.page.current = _.toInteger((this.essayTotal - 2) / this.page.size + 1);
        this.$emit('reloadData', this.page.current);
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    deleteSelectEssay() {
      let count = 0;
      _.forEach(this.$refs.selection.objData, (essay) => {
        // eslint-disable-next-line no-underscore-dangle
        if (essay._isChecked === true) {
          count += 1;
          window.console.log('delete essay content: ', essay);
          deleteEssay(essay.id).then(() => {
            this.$Message.info(`${essay.title} Deleted`);
            // eslint-disable-next-line no-mixed-operators
            this.page.current = _.toInteger((this.essayTotal - count - 1) / this.page.size + 1);
            this.$emit('reloadData', this.page.current);
          });
        }
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
      changeEssay(this.noteData)
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
