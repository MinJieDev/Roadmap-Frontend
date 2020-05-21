<template>
  <div>
    <Row :gutter="16">
      <Col span="20">
        <CellGroup>
          <Cell :title="shortedFileName" />
        </CellGroup>
      </Col>
      <Col span="2">
        <Dropdown v-if="display">
          <a href="javascript:void(0)">
            <Icon type="md-more"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem @click.native="handleAddFileNode">添加文献节点</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  name: 'FileItem',
  props: ['fileName', 'display', 'articleId', 'articleUrl'],
  data() {
    return {
    };
  },
  computed: {
    shortedFileName() {
      const maxLen = 100;
      if (this.fileName.length > maxLen) {
        return `${this.fileName.substring(0, 7)}...`;
      }
      return this.fileName;
    },
  },
  methods: {
    handleAddFileNode() {
      this.$Message.info('Node added');
      this.$emit('node-added', {
        nodeName: this.fileName,
        articleId: this.articleId,
        nodeUrl: this.articleUrl,
      });
    },
  },
};
</script>
