<template>
  <div>
    <Button
      @click="onClickNewRoadmap(0)"
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
import _ from 'lodash';
import ItemEditor from './RoadItemEditor';
import { reqSingle } from '../apis/util';
import { pushErr } from '../components/ErrPush';
import { delRoadmap, postRoadmapShareLink } from '../apis/RoadmapEditorApis';

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
        // {

        // },
        {
          title: '描述',
          key: 'description',
          width: 300,
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
                  this.onView(this.roadmaps[params.index].id);
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
                  this.onEdit(this.roadmaps[params.index].id);
                },
              },
            }, '修改'),
            h('Button', {
              props: {
                type: 'success',
                size: 'small',
              },
              style: {
                marginRight: '10px',
              },
              on: {
                click: () => {
                  this.onShare(this.roadmaps[params.index].id);
                },
              },
            }, '分享'),
            h('Button', {
              props: {
                type: 'error',
                size: 'small',
              },
              on: {
                click: () => {
                  this.onDelete(this.roadmaps[params.index].id, params.index);
                },
              },
            }, '删除'),
          ]),
        },
      ],
      data: [],
      roadmaps: [],
    };
  },
  mounted() {
    reqSingle('/api/road_maps/', 'GET', { page: 1 })
      .then((res) => {
        // window.console.log('roadmap card', res);
        this.roadmaps = res.data.results;
        this.data = this.getData();
      }).catch((err) => {
        pushErr(this, err, true);
      });
  },
  methods: {
    getData() {
      const data = [];
      let index = 0;
      _(this.roadmaps).forEach((roadmap) => {
        index += 1;
        data.push({
          id: index,
          title: roadmap.title,
          // tags: [],
          description: roadmap.description,
        });
        window.console.log(roadmap);
      });
      // test
      req('/api/tags/1', 'GET').then((res) => {
        window.console.info('[DEBUG]', res);
        // this.articles = res.data;
      }).catch((err) => {
        pushErr(this, err, true);
      });
      return data;
    },
    onView(index) {
      window.console.log('onView', index);
      this.$router.push({
        path: '/reader',
        query: { selected: index },
      });
      this.$Message.info('Click Read');
    },
    onShare(index) {
      window.console.log('onShare', index);
      postRoadmapShareLink(index).then((res) => {
        this.$Modal.success({
          title: '路书分享链接',
          content: `http://47.94.141.56/reader?sharedId=${res.data.share_id}/`,
          width: '700',
        });
      }).catch((err) => {
        pushErr(this, err, true);
      });
      this.$Message.info('Click Share');
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
    onDelete(index, posInTable) {
      delRoadmap(index).then((res) => {
        this.data.splice(posInTable, 1);
        window.console.log('onDelete', index);
        this.$Message.info(`${res.data.id} Deleted`);
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    cancelDrawer() {
      this.$Message.info('cancel drawer');
      this.drawer = false;
    },
    onClickNewRoadmap() {
      window.console.log('onNew');
      this.$router.push({
        path: '/editor',
        query: { selected: -1 },
      });
      this.$Message.info('onNew');
    },
  },
};
</script>

<style scoped>

</style>
