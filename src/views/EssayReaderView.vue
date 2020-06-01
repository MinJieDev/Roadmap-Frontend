<template>
  <div>
    <link rel="stylesheet" href="github-markdown.css">
    <div class="article-title" style="padding: 10px">
      {{ title }}
    </div>
    <div class="markdown-body">
      <VueMarkdown v-if="repaint" style="margin: 20px">{{content}}</VueMarkdown>
      <Likes></Likes>
      <Comment :comments="comments" @comment-committed="handleCommentCommitted"></Comment>
    </div>
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

export default {
  name: 'EssayEditorView',
  components: { Simplemde, VueMarkdown, Likes, Comment },
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
          if (this.refRoadmap !== -1) {
            window.console.log('fuck');
            this.$router.push({
              path: '/essayRoadmapReader/',
              query: {
                selected: this.$route.query.selected,
              },
            });
          }
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
</style>
