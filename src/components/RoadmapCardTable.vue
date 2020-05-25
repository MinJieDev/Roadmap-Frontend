<template>
  <div>
    <div style="margin-right: 10px; float: right;">
      切换布局
      <i-switch
        @on-change="onChangeViewStyle"
        size="large">
        <span slot="open">Card</span>
        <span slot="close">Table</span>
      </i-switch>
    </div>
    <div v-if="this.viewStyle==='table'">
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
        <Modal
          v-model="addTagModal"
          title="请输入要加入的tag"
          @on-ok="okAddTag"
          @on-cancel="cancelAddTag">
          <Input v-model="TagValue" style="width: 300px" />
        </Modal>
        <ItemEditor
          v-bind:drawer="drawer"
          @cancelDrawer="cancelDrawer">
        </ItemEditor>
    </div>
    <div v-else-if="this.viewStyle==='card'">
    <Row v-for="r in rows" v-bind:key="r" type="flex" justify="center" :gutter="20">
      <i-col v-for="c in cols" v-bind:key="c" span="6" align="center" >
        <!-- getIndex函数用于获取指定r和c后，路书在index中的索引。对于新建路书，getIndex会返回-1 -->
        <Card v-show="getIndex(r, c, cols) + 1 < data.length + 1"
              style="margin-bottom: 20px">
          <!--新建路书部件-->
          <div class="card_content" v-if="r === 1 && c === 1">
            <p class="single_line">
              新建路书
            </p>
            <Icon class="card_img" type="ios-book" size="250" @click="onClickNewRoadmap(0)"></Icon>
            <Button type="primary" size="small" @click="onClickNewRoadmap(0)">
              创建新的路书
            </Button>
          </div>
          <!--已有路书卡片-->
          <div class="card_content" v-else>
            <p class=single_line v-if="getIndex(r, c, cols) < data.length">
              {{data[getIndex(r, c, cols)].title}}
            </p>
            <img class="card_img" src="../assets/RoadmapDefault.png" height="250"
                 @click="onEdit(roadmaps[getIndex(r, c, cols)].id)">
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
  </div>
</template>

<script>
import _ from 'lodash';
import ItemEditor from './RoadItemEditor';
import { reqSingle } from '../apis/util';
import { pushErr } from '../components/ErrPush';
import { delRoadmap, postRoadmapShareLink, updateTag, getTags } from '../apis/RoadmapEditorApis';

export default {
  name: 'RoadmapCardTable',
  components: { ItemEditor },
  data() {
    return {
      drawer: false,
      addTagModal: false,
      tagIndex: -1,
      tagPos: -1,
      TagValue: '',
      cols: 3,
      viewStyle: 'card',
      data: [],
      roadmaps: [],
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
          title: '描述',
          key: 'description',
          width: 300,
          align: 'center',
        },
        {
          title: '标签',
          key: 'tag',
          width: 200,
          align: 'center',
          render: (h, params) => {
            const tags = this.data[params.index].tags;
            return h('div', [(tags || []).map(item => h('Tag', {
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
            )), h('Button', {
              props: {
                icon: 'ios-add',
                type: 'dashed',
                size: 'small',
              },
              on: {
                click: () => {
                  this.addTagModal = true;
                  this.tagIndex = this.roadmaps[params.index].id;
                  this.tagPos = params.index;
                },
              },
            })]);
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
    };
  },
  mounted() {
    reqSingle('/api/road_maps/', 'GET', { page: 1 })
      .then((res) => {
        // window.console.log('roadmap card', res);
        this.roadmaps = res.data.results;
        this.data = this.getData();
        this.refreshTags();
      })
      .catch((err) => {
        pushErr(this, err, true);
      });
  },
  computed: {
    rows() {
      const newRows = parseInt(String(((this.data.length + 1) / this.cols) + 1), 10);
      window.console.info('Card Rows Change', newRows);
      return newRows;
    },
  },
  methods: {
    okAddTag() {
      updateTag(this.TagValue, [this.tagIndex])
        .catch((err) => {
          pushErr(this, err, true);
        });
      this.data[this.tagPos].tags.push({ name: this.TagValue, color: 'success' });
      this.TagValue = '';
      this.tagIndex = -1;
      this.tagPos = -1;
      this.addTagModel = false;
    },
    cancelAddTag() {
      getTags().then((res) => {
        window.console.info(res);
      }).catch((err) => {
        pushErr(this, err, true);
      });
      this.TagValue = '';
      this.tagIndex = -1;
      this.addTagModel = false;
    },
    getIndex(r, c, col) {
      return (((r - 1) * col) + (c - 1)) - 1;
    },
    refreshTags() {
      let tagsData = 0;
      getTags().then((res) => {
        if (res !== undefined) {
          tagsData = res.data;
          _(this.data)
            .forEach((dataItem) => {
              const dataId = this.roadmaps[dataItem.id - 1].id;
              _(tagsData)
                .forEach((tagItem) => {
                  if (dataId === tagItem.roadmaps[0]) {
                    this.data[dataItem.id - 1].tags.push({
                      name: tagItem.name,
                      color: 'success',
                    });
                  }
                });
            });
        }
      }).catch((err) => {
        pushErr(this, err, true);
      });
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
            tags: [],
            description: roadmap.description,
          });
          // window.console.log(roadmap);
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
    onChangeViewStyle() {
      window.console.log('switch view style');
      if (this.viewStyle === 'card') {
        this.viewStyle = 'table';
      } else {
        this.viewStyle = 'card';
      }
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
  .card_img{
    cursor: pointer;  /*鼠标悬停变小手*/
  }
</style>
