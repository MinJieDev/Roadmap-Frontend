<template>
  <div>
    <link rel="stylesheet" href="github-markdown.css">
    <Row>
      <Col span="20">
        <div v-if="!titleEditable" class="article-title" style="padding: 12px">
          {{ title }}
          <Icon type="ios-create-outline" @click="handleClkEditTitle" />
        </div>
        <Input ref="titleInput"
               v-model="title"
               v-if="titleEditable"
               @on-blur="handleUpdateTitle"
               size="large" style="padding: 12px">
        </Input>
      </Col>
      <Col span="4">
        <div v-if="bindRoadmap!==-1">
          <h4 style="text-align: left; margin-bottom: 5px">路书已绑定：{{ bindRoadmapName }}</h4>
        </div>
        <div v-else>
          <h4 style="text-align: left; margin-bottom: 5px">选择引用的路书</h4>
        </div>
        <Select v-model="refRoadmap" style="width:200px" :disabled="bindRoadmap!==-1"
                @on-select="sel">
          <Option v-for="item in roadmaps" :value="item.id" :key="item.id">{{ item.title }}
          </Option>
        </Select>
      </Col>
    </Row>
    <Divider/>
    <Button type="primary" @click="save" style="margin-left: 40px">保存</Button>
    <Button type="warning" @click="cancel" style="margin-left: 10px">取消</Button>
    <Row :gutter="50"
         style="margin-left: 20px; margin-right: 20px; margin-top: 10px; margin-bottom: 20px">
      <Col span="12">
        <div class="markdown-wrapper">
          <textarea ref="editor">
          </textarea>
        </div>
      </Col>
      <Col span="12">
        <div class="markdown-body">
          <VueMarkdown v-if="refreshPreview">{{inputData}}</VueMarkdown>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import Simplemde from 'simplemde';
import _ from 'lodash';
import 'simplemde/dist/simplemde.min.css';
import 'github-markdown-css';
import VueMarkdown from 'vue-markdown';
import { pushErr } from '../components/ErrPush';
import { req, reqSingle } from '../apis/util';
import { getEssay, updateEssay } from '../apis/EssayEditorApis';

export default {
  name: 'EssayEditorView',
  components: { Simplemde, VueMarkdown },
  props: {},
  data() {
    return {
      text: null,
      refRoadmap: -1,
      bindRoadmap: -1,
      editor: null,
      title: '新随笔',
      titleEditable: false,
      refreshPreview: true,
      roadmaps: [],
    };
  },
  methods: {
    save() {
      const dataChange = {
        bindRoadmap: this.bindRoadmap,
        refRoadmap: this.refRoadmap,
        content: this.editor.value(),
      };
      window.console.info(dataChange);
      // create new essay
      if (String(this.$route.query.selected) === '-1') {
        reqSingle('/api/essays/', 'POST',
          {
            title: this.title,
            text: JSON.stringify(dataChange),
          },
        ).then((res) => {
          this.$Message.info('创建成功! id=', res.data.id);
          this.$router.push({
            path: '/essayEditor',
            query: { selected: res.data.id },
          });
        }).catch((err) => {
          pushErr(this, err, true);
        });
      } else { // update essay
        updateEssay(this.$route.query.selected, this.title, JSON.stringify(dataChange))
          .then((res) => {
            this.$Message.info(`修改成功! id=${res.data.id}`);
          }).catch((err) => {
            pushErr(this, err, true);
          });
      }
    },
    cancel() {
      this.$router.push({
        path: '/essayTable',
      });
    },
    handleClkEditTitle() {
      this.titleEditable = true;
      // 焦点定位于输入框
      this.$nextTick(() => this.$refs.titleInput.focus());
    },
    handleUpdateTitle() {
      this.titleEditable = false;
    },
    getData() {
      getEssay(this.$route.query.selected)
        .then((res) => {
          this.text = JSON.parse(res.data.text);
          window.console.log(this.text);
          this.editor.value(this.text.content);
          this.refRoadmap = this.text.refRoadmap;
          this.bindRoadmap = this.text.bindRoadmap;
          this.title = res.data.title;
        })
        .catch((err) => {
          pushErr(this, err, true);
        });
      req('/api/road_maps/', 'GET').then((res) => {
        // window.console.log(res.data);
        this.roadmaps = res.data;
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    sel() {
      window.console.log('ref', this.refRoadmap);
    },
  },
  mounted() {
    this.editor = new Simplemde({
      placeholder: '请输入您的随笔...',
      toolbar: ['bold', 'italic', 'heading', '|',
        'quote', 'code', '|',
        'unordered-list', 'ordered-list', '|',
        'link', 'image', '|', 'preview'],
    });
    if (String(this.$route.query.selected) !== '-1') {
      this.getData();
    }
  },
  computed: {
    inputData() {
      if (this.editor === null) {
        return '';
      }
      return this.editor.value();
    },
    bindRoadmapName() {
      if (this.bindRoadmap !== -1) {
        const r = _.find((this.roadmaps), rdm => String(rdm.id) === String(this.bindRoadmap));
        return r ? r.title : '';
      }
      return '';
    },
  },
  watch: {
    inputData() {
      this.refreshPreview = false;
      this.$nextTick(() => {
        this.refreshPreview = true;
      });
    },
  },
};
</script>


<style scoped>
  .article-title {
    text-align: left;
    font-size: 24px;
    margin-left: 20px;
  }
</style>
