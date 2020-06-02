<template>
  <div>
    <link rel="stylesheet" href="github-markdown.css">
    <div class="article-title" style="padding: 10px">
      {{ title }}
    </div>
    <div class="markdown-body">
      <VueMarkdown v-if="repaint" style="margin: 20px">{{content}}</VueMarkdown>
      <Likes @on-share="handleClkShare"></Likes>
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
import { postEssayShareLink, getEssayShareLink } from '../apis/EssayEditorApis';

export default {
  name: 'EssayEditorView',
  components: { Simplemde, VueMarkdown, Likes, Comment },
  props: {},
  data() {
    return {
      sharedId: -1,
      essayId: -1,
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
      this.essayId = this.$route.query.selected;
      req(`/api/essays/${this.essayId}/`, 'GET')
        .then((res) => {
          this.text = JSON.parse(res.data.text);
          this.content = this.text.content;
          this.refRoadmap = this.text.refRoadmap;
          this.bindRoadmap = this.text.bindRoadmap;
          this.title = res.data.title;
          this.repaint = true;
          if (this.refRoadmap !== -1) {
            this.$router.push({
              path: '/essayRoadmapReader/',
              query: {
                selected: this.essayId,
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
    handleClkShare() {
      if (this.sharedId !== -1) {
        this.$Modal.success({
          title: '随笔分享链接',
          content: `http://47.94.141.56/essayReader?sharedId=${this.sharedId}`,
          width: '700',
        });
      } else {
        postEssayShareLink(this.essayId).then((res) => {
          this.$Modal.success({
            title: '随笔分享链接',
            content: `http://47.94.141.56/essayReader?sharedId=${res.data.share_id}/`,
            width: '700',
          });
        }).catch((err) => {
          pushErr(this, err, true);
        });
      }
    },
  },
  mounted() {
    if (!this.$route.query.selected) {
      this.sharedId = this.$route.query.sharedId;
      getEssayShareLink(this.sharedId).then((res) => {
        this.text = JSON.parse(res.data.text);
        this.content = this.text.content;
        this.refRoadmap = this.text.refRoadmap;
        this.bindRoadmap = this.text.bindRoadmap;
        this.title = res.data.title;
        this.repaint = true;
        if (this.refRoadmap !== -1) {
          this.$router.push({
            path: '/essayRoadmapReader/',
            query: {
              sharedId: this.sharedId,
            },
          });
        }
      }).catch((err) => {
        pushErr(this, err, true);
      });
    } else if (String(this.$route.query.selected) !== '-1') {
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
