<template>
  <div>
    <ItemEditor
      v-bind:drawer="drawer"
      v-bind:index="index"
      v-bind:drawerFormData="drawerFormData"
      @cancelDrawer="cancelDrawer"
      @submitDrawer="submitDrawer"
    >
    </ItemEditor>
    <Button
      @click="openDrawer(-1)"
      type="primary"
      style="margin-left: 10px; margin-bottom: 10px ">
      Create
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
import errPush from '../components/ErrPush';
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
        },
        {
          title: 'Author',
          key: 'author',
        },
        {
          title: 'Url',
          key: 'url',
        },
        {
          title: 'Note',
          key: 'note',
        },
        {
          title: 'Ref',
          key: 'ref',
          tree: true,
        }, {
          title: 'Action',
          key: 'action',
          width: 150,
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
                  this.onView(params.index);
                },
              },
            }, 'View'),
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
            }, 'Delete'),
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
      window.console.log('onView', index);
      this.$Message.info('Click View');
      this.openDrawer(index);
    },
    onDelete(index) {
      deleteMTdata(this.data[index].id)
        .then((res) => {
          // this.data.splice(index, 1);
          this.data = _.slice(this.data, index, index + 1);
          window.console.log('onDelete', index, this.data);
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
        this.drawerFormData = this.data[this.index];
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
          '',
          drawerFormData.url,
          drawerFormData.note,
          drawerFormData.article_references)
          .then(() => {
            this.$Notice.success('MT data created');
            this.$emit('reloadData');
          })
          .catch(() => {
            errPush(this, '4000', true);
          });
      } else {
        // (id, title, author, url, ref)
        changeMTdata(
          drawerFormData.id,
          drawerFormData.title,
          drawerFormData.author,
          drawerFormData.url,
          drawerFormData.article_references,
        )
          .then(() => {
            this.$Notice.success('MT data change');
            this.$emit('reloadData');
          })
          .catch(() => {
            errPush(this, '4000', true);
          });
      }
      this.drawer = false;
    },
  },
};
</script>

<style scoped>

</style>
