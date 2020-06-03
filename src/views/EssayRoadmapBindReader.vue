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
        <Likes @on-share="handleClkShare" @on-like="handleClkLike" @on-unlike="handleClkUnlike"
               :like="like" :me="user"></Likes>
          <Comment :comment="comment" @comment-committed="handleCommentCommitted"></Comment>
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
import _ from 'lodash';
import 'simplemde/dist/simplemde.min.css';
import 'github-markdown-css';
import VueMarkdown from 'vue-markdown';
import { pushErr } from '../components/ErrPush';
import Likes from '../components/Likes';
import Comment from '../components/comment/Comment';
import RoadmapWindow from '../components/RoadmapWindow';
import { getEssay, getEssayShareLink, postEssayShareLink, putCommentId, putCommentSHA, putLikeSHA, putUnlikeSHA } from '../apis/EssayEditorApis';
import { createComment } from '../apis/RoadmapEditorApis';
import { getUser } from '../apis/UserProfileApis';


export default {
  name: 'EssayEditorView',
  components: { Simplemde, VueMarkdown, Likes, Comment, RoadmapWindow },
  props: {},
  data() {
    return {
      user: null,
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
      comment: [],
      like: [],
      mountRoadmapWindow: false,
    };
  },
  computed: {
    commentId() {
      let ret = [];
      _(this.comment).forEach((comm) => {
        ret = [...ret, comm.id];
      });
      return ret;
    },
  },
  methods: {
    getData() {
      window.console.log(`/api/essays/${this.$route.query.selected}/`);
      this.essayId = this.$route.query.selected;
      getUser().then((res1) => {
        this.user = res1.data;
        getEssay(this.essayId)
          .then((res) => {
            this.like = res.data.like;
            this.comment = res.data.comment;
            this.text = JSON.parse(res.data.text);
            this.content = this.text.content;
            this.refRoadmap = this.text.refRoadmap;
            this.bindRoadmap = this.text.bindRoadmap;
            this.title = res.data.title;
            this.repaint = true;
            this.mountRoadmapWindow = true;
          }).catch((err) => {
            pushErr(this, err, true);
          });
      }).catch((err) => {
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
      createComment(com).then((res) => {
        if (String(this.sharedId) !== '-1') {
          putCommentSHA(this.sharedId, res.data.id).then(() => {
            getEssayShareLink(this.sharedId).then((res3) => {
              this.comment = res3.data.comment;
            });
          });
        } else {
          putCommentId(this.essayId, [...this.commentId, res.data.id]).then(() => {
            getEssay(this.essayId).then((res3) => {
              this.comment = res3.data.comment;
            });
          });
        }
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
    handleClkLike() {
      window.console.log('like');
      if (String(this.sharedId) !== '-1') {
        putLikeSHA(this.sharedId).then((res) => {
          this.like = res.data.like;
        }).catch((err) => {
          pushErr(this, err, true);
        });
      } else {
        this.$Notice.info({ title: '不能给自己点赞哦' });
      }
    },
    handleClkUnlike() {
      window.console.log('unlike');
      if (String(this.sharedId) !== '-1') {
        putUnlikeSHA(this.sharedId).then((res) => {
          this.like = res.data.like;
        }).catch((err) => {
          pushErr(this, err, true);
        });
      } else {
        this.$Notice.info({ title: '不能给自己点赞哦' });
      }
    },
  },
  mounted() {
    if (!this.$route.query.selected) {
      this.sharedId = this.$route.query.sharedId;
      getUser().then((res1) => {
        this.user = res1.data;
        getEssayShareLink(this.sharedId)
          .then((res) => {
            this.like = res.data.like;
            this.comment = res.data.comment;
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
