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
          <Likes @on-share="handleClkShare"></Likes>
          <Comment :comments="comments" @comment-committed="handleCommentCommitted"></Comment>
      </Col>
      <Col span="11" id="roadmap">
        <RoadmapWindow :road-map-id="refRoadmap" :sharedId="roadmapSharedId"
                       v-if="mountRoadmapWindow">
        </RoadmapWindow>
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
import { getEssayShareLink, postEssayShareLink } from '../apis/EssayEditorApis';

export default {
  name: 'EssayEditorView',
  components: { Simplemde, VueMarkdown, Likes, Comment, RoadmapWindow },
  props: {},
  data() {
    return {
      sharedId: -1,
      essayId: -1,
      text: null,
      refRoadmap: -1,
      bindRoadmap: -1,
      roadmapSharedId: -1,
      content: '',
      title: '新随笔',
      titleEditable: false,
      refreshPreview: true,
      repaint: false,
      comments: [],
      mountRoadmapWindow: false,
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
          this.mountRoadmapWindow = true;
        })
        .catch((err) => {
          pushErr(this, err, true);
        });
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
    handleCommentCommitted(com) {
      window.console.log('com', com);
      this.comments = [...this.comments, com];
    },
  },
  mounted() {
    if (!this.$route.query.selected) {
      this.sharedId = this.$route.query.sharedId;
      getEssayShareLink(this.sharedId).then((res) => {
        this.text = JSON.parse(res.data.text);
        this.content = this.text.content;
        this.roadmapSharedId = res.data.refRoadmapSHA;
        this.bindRoadmap = this.text.bindRoadmap;
        this.title = res.data.title;
        this.repaint = true;
        this.mountRoadmapWindow = true;
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
