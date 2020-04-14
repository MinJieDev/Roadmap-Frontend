<template>
    <Modal
      v-model="ErrModalStatus"
      :title="ErrTitle"
      @on-ok="ok"
      @on-cancel="cancel">
      <p>{{ ErrContent }}</p>
    </Modal>
</template>

<script>
import Modal from 'view-design/src/components/modal';

export default {
  name: 'ErrModal',
  props: ['ErrModalStatus', 'ErrTitle', 'ErrContent'],
  components: {
    Modal,
  },
  data() {
    return {
    };
  },
  methods: {
    push() {
      if (this.ErrModalStatus === false) {
        this.$Message.info('Error');
      }
    },
    ok() {
      this.$emit('cancelErrModal');
    },
    cancel() {
      this.$emit('cancelErrModal');
    },
  },
};
</script>


/*
  How to notice Error?
  - Method 1 : Error Modal
    - import ErrModal from './components/ErrModal';
    - include ErrModal to template
    - <ErrModal
        v-bind:ErrModalStatus="ErrModalStatus"
        v-bind:ErrContent="ErrContent"
        v-bind:ErrTitle="ErrTitle"
        @cancelErrModal="cancelErrModal">
      </ErrModal>
    - Init data:
        ErrModalStatus: false,
        ErrContent: '',
        ErrTitle: '',
    - Add Method: call pushError() to get error modal
    - pushError() {
        this.ErrContent = 'hhh';
        this.ErrTitle = 'ddd';
        this.ErrModalStatus = true;
      },
    - cancelErrModal() {
        window.console.error('[ERROR]: ', this.ErrTitle, this.ErrContent);
        this.modal1 = false;
        window.console.log('updateModal1');
      },

  - Method 2: Error Message
    -      this.$Message.error({
              background: true,
              content: 'Error Content',
              duration: 5,
              closable: true,
            });
*/
