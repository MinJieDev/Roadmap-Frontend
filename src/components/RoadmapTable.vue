<template>
  <div>
    <Button
      @click="opendrawer(0)"
      type="primary"
      style="margin-left: 10px; margin-bottom: 10px ">
      新建路书
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
import ItemEditor from './RoadItemEditor';

export default {
  name: 'RoadmapTable',
  components: { ItemEditor },
  data() {
    return {
      drawer: false,
      columns: [
        {
          title: '序号',
          key: 'id',
          width: 100,
          align: 'center',
        },
        {
          title: '标题',
          key: 'title',
          align: 'center',
        },
        {
          title: '标签',
          key: 'tag',
          width: 300,
          align: 'center',
          render: (h, params) => {
            const tags = this.data[params.index].tags;
            return h('div', (tags || []).map(item => h('Tag', {
              props: {
                // type: 'border',
                key: item.name,
                name: item.name,
                color: item.color,
                closable: true,
                style: 'margin-left: 3px',
              },
            },
            item.name,
            )));
          },
        },
        {
          title: '操作',
          key: 'action',
          width: 300,
          align: 'center',
          render: (h, params) => h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small',
              },
              style: {
                marginRight: '10px',
              },
              on: {
                click: () => {
                  this.onView(params.index);
                },
              },
            }, '查看'),
            h('Button', {
              props: {
                type: 'warning',
                size: 'small',
              },
              style: {
                marginRight: '10px',
              },
              on: {
                click: () => {
                  this.onEdit(params.index);
                },
              },
            }, '修改'),
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
      data: this.getData(),
    };
  },
  methods: {
    getData() {
      const data = [];
      data.push({
        id: '1',
        title: 'Development of Learning-based Codec',
        tags: [
          { name: 'deep learning', color: 'primary' },
          { name: 'Codec', color: 'success' },
        ],
      });
      data.push({
        id: '2',
        title: 'New papers in GAN(Generative adversary network)',
      });
      return data;
    },
    onView(index) {
      window.console.log('onView', index);
      this.$Message.info('Click View');
      this.opendrawer(index);
    },
    onEdit(index) {
      window.console.log('onEdit', index);
      this.$router.push({
        path: '/editor',
        query: { selected: index },
      });
      this.$Message.info('Click Edit');
    },
    opendrawer(index) {
      window.console.log(index);
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
