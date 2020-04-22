<template>
  <div>
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
    <ItemEditor
      v-bind:drawer="drawer"
      v-bind:index="index"
      v-bind:data="data"
      @cancelDrawer="cancelDrawer">
    </ItemEditor>
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
      columns: [
        {
          title: 'Title',
          key: 'title',
          tree: true,
        },
        {
          title: 'Url',
          key: 'url',
        },
        {
          title: 'Note',
          key: 'note',
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
    openDrawer(index) {
      this.index = index;
      this.drawer = true;
    },
    onDelete(index) {
      this.data.splice(index, 1);
      window.console.log('onDelete', index);
      this.$Message.info('Click Delete');
    },
    cancelDrawer() {
      this.$Message.info('cancel drawer');
      this.drawer = false;
    },
  },
};
</script>

<style scoped>

</style>
