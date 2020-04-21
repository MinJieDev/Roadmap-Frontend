<template>
  <div>
    <Button
      @click="opendrawer(0)"
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
      this.opendrawer(index);
    },
    opendrawer(index) {
      window.console.log(index);
      this.drawer = true;
    },
    onDelete(index) {
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
