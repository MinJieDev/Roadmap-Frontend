<template>
  <div>
    <Drawer
      title="查看"
      v-model="drawer"
      width="720"
      :closable="false"
      :mask-closable="false"
      :styles="styles"
      @on-close="cancelDrawer"
    >
      <Row :gutter="32">
        <Col span="22">
          <br>
          <h3>题名</h3>
          <br>
          <Row :gutter="50" style="margin-left: 20px">
            <Input
              v-model="drawerData.title"
              clearable
              placeholder="请输入题目">
            </Input>
          </Row>
        </Col>
      </Row>

      <Row :gutter="32">
        <Col span="22">
          <br>
          <h3>显示名</h3>
          <br>
          <Row :gutter="50" style="margin-left: 20px">
            <Input
              v-model="drawerData.abbrtitle"
              clearable
              placeholder="请输入文献显示名">
            </Input>
          </Row>
        </Col>
      </Row>

      <Row :gutter="32">
        <Col span="22">
          <br>
          <h3>作者</h3>
          <br>
          <Row :gutter="50" style="margin-left: 20px">
            <Input
              v-model="drawerData.author"
              clearable
              placeholder="请输入作者">
            </Input>
          </Row>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="7">
          <br>
          <h3>年份</h3>
          <br>
          <Row :gutter="50" style="margin-left: 20px">
            <Input
              v-model="drawerData.years"
              clearable
              placeholder="请输入文章所属年份">
            </Input>
          </Row>
        </Col>
        <Col span="14">
          <br>
          <h3>阅读状态</h3>
          <br>
          <Row :gutter="30" style="margin-left: 10px; margin-top: 2px;">
            <Col>
              <Slider
                v-model="sliderValue"
                :step="slider.step"
                :max="slider.max"
                :marks="slider.marks"
                :tip-format="hideTipFormat"
                @on-change="sliderChange"
              ></Slider>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row :gutter="32">
        <Col span="22">
          <br>
          <h3>链接(URL)</h3>
          <br>
          <Row :gutter="50" style="margin-left: 20px">
            <Input
              v-model="drawerData.url"
              clearable
              placeholder="请输入网址(URL)">
              <span slot="prepend">http://</span>
            </Input>
          </Row>
        </Col>
      </Row>

      <Row :gutter="32">
        <Col span="16">
          <br>
          <h3>期刊/会议</h3>
          <br>
          <Row :gutter="50" style="margin-left: 20px">
          <Input
            v-model="drawerData.journal"
            clearable
            placeholder="请输入文章所属的期刊/会议">
          </Input>
          </Row>
        </Col>
      </Row>

      <Row :gutter="32">
        <Col span="8">
          <br>
          <h3>卷号</h3>
          <br>
          <Row :gutter="50" style="margin-left: 20px">
          <Input
            v-model="drawerData.volume"
            clearable
            placeholder="请输入文章所属的卷号">
          </Input>
          </Row>
        </Col>

        <Col span="8">
          <br>
          <h3>页面</h3>
          <br>
          <Row :gutter="50" style="margin-left: 20px">
          <Input
            v-model="drawerData.pages"
            clearable
            placeholder="请输入文章所属的页面">
          </Input>
          </Row>
        </Col>
      </Row>
      <br>
      <br>
      <h3>引用文献</h3>
      <br>
      <Row :gutter="50" style="margin-left: 30px">
        <Transfer
          :data="transferData"
          :target-keys="targetKeys"
          filterable
          @on-change="handleTransferChange"></Transfer>
      </Row>

      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="cancelDrawer">取消</Button>
        <Button type="primary" @click="submitDrawer">提交修改</Button>
      </div>
    </Drawer>
  </div>
</template>
<script>
import _ from 'lodash';

export default {
  name: 'ItemEditor',
  props: {
    articles: {
      type: Array,
      required: true,
    },
    drawer: {
      type: Boolean,
    },
    index: {
      type: Number,
      default: -1,
    },
    drawerData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      slider: {
        max: 4,
        step: 1,
        marks: {
          1: {
            style: {
              color: '#ff0000',
            },
            label: this.$createElement('strong', '未读'),
          },
          2: {
            style: {
              color: '#2db7f5',
            },
            label: this.$createElement('strong', '在读'),
          },
          3: {
            style: {
              color: '#19be6b',
            },
            label: this.$createElement('strong', '已读'),
          },
        },
      },
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static',
      },
    };
  },
  computed: {
    targetKeys() {
      return this.drawerData.article_references;
    },
    transferData() {
      return _.map(this.articles, atc => ({ key: atc.id, label: atc.title }));
    },
    sliderValue() {
      if (this.drawerData.read_state === 'U') {
        return 1;
      } else if (this.drawerData.read_state === 'I') {
        return 2;
      }
      return 3;
    },
  },
  methods: {
    cancelDrawer() {
      this.$emit('cancelDrawer');
    },
    submitDrawer() {
      if (this.drawerData.abbrtitle === '') {
        this.drawerData.abbrtitle = this.drawerData.title;
      }
      this.$emit('submitDrawer', this.drawerData);
    },
    handleTransferChange(newTargetKeys) {
      this.drawerData.article_references = newTargetKeys;
    },
    sliderChange(value) {
      if (value <= 1) {
        this.drawerData.read_state = 'U';
      } else if (value === 2) {
        this.drawerData.read_state = 'I';
      } else {
        this.drawerData.read_state = 'F';
      }
    },
    hideTipFormat() {
      return null;
    },
  },
};
</script>
<style>
  .demo-drawer-footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
  }
</style>

