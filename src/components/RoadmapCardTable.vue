<template>
  <div>
    <Row v-for="r in rows*2" v-bind:key="r" type="flex" justify="center" :gutter="20">
      <i-col v-for="c in cols" v-bind:key="c" span="6" align="center" >
        <!-- getIndex函数用于获取指定r和c后，路书在index中的索引。对于新建路书，getIndex会返回-1 -->
        <Card v-show="getIndex(r, c, cols) + 1 < data.length + 1">
          <!--新建路书部件-->
          <div class="card_content" v-if="r === 1 && c === 1">
            <p class="single_line">
              新建路书
            </p>
            <Icon type="ios-book" size="250"></Icon>
            <Button type="primary" size="small" @click="onClickNewRoadmap(0)">
              创建新的路书
            </Button>
          </div>
          <!--已有路书卡片-->
          <div class="card_content" v-else>
            <p class=single_line v-if="getIndex(r, c, cols) < data.length">
              {{data[getIndex(r, c, cols)].title}}
            </p>
            <img src="../assets/RoadmapDefault.png" height="250">
            <br>
            <Button type="primary" size="small" @click="onView(roadmaps[getIndex(r, c, cols)].id)">
              查看
            </Button>
            <Button type="warning" size="small" @click="onEdit(roadmaps[getIndex(r, c, cols)].id)">
              修改
            </Button>
            <Button type="success" size="small" @click="onShare(roadmaps[getIndex(r, c, cols)].id)">
              分享
            </Button>
            <Button type="error" size="small" @click="onDelete(roadmaps[getIndex(r, c, cols)].id)">
              删除
            </Button>
          </div>
        </Card>
      </i-col>
      <br>
      <br>
      </Row>
    <!-- 抽屉暂未使用，用于创建自动生成的路书 -->
    <ItemEditor
      v-bind:drawer="drawer"
      @cancelDrawer="cancelDrawer">
    </ItemEditor>
  </div>
</template>

<script>
import _ from 'lodash';
import ItemEditor from './RoadItemEditor';
import { req } from '../apis/util';
import { pushErr } from '../components/ErrPush';
import { delRoadmap, postRoadmapShareLink } from '../apis/RoadmapEditorApis';

export default {
  name: 'RoadmapCardTable',
  components: { ItemEditor },
  data() {
    return {
      drawer: false,
      rows: 4,
      cols: 3,
      data: [],
      roadmaps: [],
    };
  },
  mounted() {
    req('/api/road_maps/', 'GET')
      .then((res) => {
        this.roadmaps = res.data;
        this.data = this.getData();
      })
      .catch((err) => {
        pushErr(this, err, true);
      });
  },
  methods: {
    getIndex(r, c, col) {
      return (((r - 1) * col) + (c - 1)) - 1;
    },
    getData() {
      const data = [];
      let index = 0;
      _(this.roadmaps)
        .forEach((roadmap) => {
          index += 1;
          data.push({
            id: index,
            title: roadmap.title,
            // tags: [],
            description: roadmap.description,
          });
          window.console.log(roadmap);
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
      postRoadmapShareLink(index)
        .then((res) => {
          this.$Modal.success({
            title: '路书分享链接',
            content: `http://47.94.141.56/reader?sharedId=${res.data.share_id}/`,
            width: '700',
          });
        })
        .catch((err) => {
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
      delRoadmap(index)
        .then((res) => {
          this.data.splice(posInTable, 1);
          window.console.log('onDelete', index);
          this.$Message.info(`${res.data.id} Deleted`);
        })
        .catch((err) => {
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
  /*单行文本的溢出显示省略号*/
  .single_line{
    height: 25px;
    vertical-align: middle;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  .card_content{
    height: 300px;
    width: 250px;
    text-align: center;
    align-content: center;
  }
</style>
