<template>
  <div>
    <link rel="stylesheet" href="github-markdown.css">
    <div class="article-title" style="padding: 10px">
      {{ title }}
    </div>
    <Row>
      <Col span="12" style="border-right:thick double #000000;" >
        <div class="markdown-body" >
          <VueMarkdown v-if="repaint" id="md">{{content}}</VueMarkdown>
        </div>
          <Likes></Likes>
          <Comment :comments="comments" @comment-committed="handleCommentCommitted"></Comment>
      </Col>
      <Col span="11" id="roadmap">
        <RoadmapWindow :road-map-id="refRoadmap"></RoadmapWindow>
      </Col>
    </Row>
  </div>
</template>

<script>
import Simplemde from 'simplemde';
import 'simplemde/dist/simplemde.min.css';
import 'github-markdown-css';
import VueMarkdown from 'vue-markdown';
import { pushErr } from '../components/ErrPush';
import { req } from '../apis/util';
import Likes from '../components/Likes';
import Comment from '../components/comment/Comment';
import RoadmapWindow from '../components/RoadmapWindow';

export default {
  name: 'EssayEditorView',
  components: { Simplemde, VueMarkdown, Likes, Comment, RoadmapWindow },
  props: {},
  data() {
    return {
      text: null,
      refRoadmap: -1,
      bindRoadmap: -1,
      content: '',
      title: '新随笔',
      titleEditable: false,
      refreshPreview: true,
      repaint: false,
      comments: [],
    };
  },
  methods: {
    getData() {
      window.console.log(`/api/essays/${this.$route.query.selected}/`);
      req(`/api/essays/${this.$route.query.selected}/`, 'GET')
        .then((res) => {
          this.text = JSON.parse(res.data.text);
          this.content = this.text.content;
          this.refRoadmap = this.text.refRoadmap;
          this.bindRoadmap = this.text.bindRoadmap;
          this.title = res.data.title;
          this.repaint = true;
        })
        .catch((err) => {
          pushErr(this, err, true);
        });
    },
    handleCommentCommitted(com) {
      window.console.log('com', com);
      this.comments = [...this.comments, com];
    },
  },
  mounted() {
    if (String(this.$route.query.selected) !== '-1') {
      this.getData();
    }
  },
};
</script>


<style scoped>
  .article-title {
    text-align: left;
    font-size: 24px;
    margin-left: 20px;
  }
  #md {
    min-height: 280px;
    margin: 20px;
  }
  #roadmap {
    position: fixed;
    right: 50px;
    top: 120px;
  }
</style>
