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
import ItemEditor from './TableItemEditor';

export default {
  name: 'MindTable',
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  components: { ItemEditor },
  data() {
    return {
      drawer: false,
      index: -1,
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
  methods: {
    onView(index) {
      window.console.log('onView', index);
      this.$Message.info('Click View');
      this.openDrawer(index);
    },
    onDelete(index) {
      this.data.splice(index, 1);
      window.console.log('onDelete', index);
      this.$Message.info('Click Delete');
    },
    openDrawer(index) {
      this.index = index;
      if (this.data[this.index] === undefined) {
        this.drawerFormData.title = '';
        this.drawerFormData.url = '';
        this.drawerFormData.note = '';
      } else {
        this.drawerFormData.title = this.data[this.index].title;
        this.drawerFormData.url = this.data[this.index].url;
        this.drawerFormData.note = this.data[this.index].note;
      }
      this.drawer = true;
    },
    cancelDrawer() {
      this.$Message.info('cancel drawer');
      this.drawer = false;
    },
    submitDrawer() {
      this.$Message.info('submit drawer');
      this.drawer = false;
    },
  },
};
</script>

<style scoped>

</style>
