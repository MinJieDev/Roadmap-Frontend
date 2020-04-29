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
    <Table row-key="id"
           :columns="columns"
           :data="data"
           border>
    </Table>
  </div>
</template>
<script>
import _ from 'lodash';
import { pushErr } from '../components/ErrPush';
import ItemEditor from './TableItemEditor';
import { deleteMTdata, createMTdata, changeMTdata } from '../apis/MindTableEditorApis';

export default {
  name: 'MindTable',
  props: {
    tableData: {
      type: Array,
      required: true,
    },
  },
  components: { ItemEditor },
  data() {
    return {
      drawer: false,
      index: 0,
      drawerFormData: {
        title: '',
        url: '',
        note: '',
      },
      columns: [
        {
          title: 'Title',
          key: 'title',
          width: 230,
        },
        {
          title: 'Author',
          key: 'author',
          width: 150,
        },
        {
          title: 'Url',
          key: 'url',
          width: 200,
        },
        {
          title: 'Journal/Conference',
          key: 'journal',
          width: 200,
        },
        {
          title: 'Note',
          key: 'note',
          // width: 300,
        },
        // {
        //   title: 'Ref',
        //   key: 'ref',
        //   tree: true,
        // },
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
      return _.slice(this.tableData, 0, this.tableData.length);
    },
  },
  methods: {
    onView(index) {
      this.$Message.info('Click View');
      this.openDrawer(index);
    },
    onDelete(index) {
      deleteMTdata(this.data[index].id)
        .then((res) => {
          // this.data.splice(index, 1);
          this.data = _.slice(this.data, index, index + 1);
          this.$Message.info(`${res.title} Deleted`);
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
  },
};
</script>

<style scoped>

</style>
