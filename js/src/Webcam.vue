<template>
    <div id="webcam-view">
  <button v-on:click="changeCamera">Change camera</button>
  <p>Chosen camera n. {{selectedCamera+1}} out of {{ cameras.length }}</p>
        <video ref="video" v-bind:width="width" v-bind:height="height" :src="this.source" autoplay="true"></video>
    </div>  
</template>

<script>
export default {
  data() {
    return {
      selectedCamera: 0,
      stream: "",
      source: "",
      canvas: null,
      cameras: []
    };
  },
  props: {
    width: {
      type: Number,
      default: 500
    },
    height: {
      type: Number,
      default: 500
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    screenshotFormat: {
      type: String,
      default: "image/jpeg"
    }
  },
  mounted() {
    if (!this.hasMedia()) {
      this.$emit("notsupported");
      return;
    }

    navigator.mediaDevices.enumerateDevices().then(
      deviceInfos => {
        for (var i = 0; i !== deviceInfos.length; ++i) {
          var deviceInfo = deviceInfos[i];
          if (deviceInfo.kind === "videoinput") {
            this.cameras.push({
              name: deviceInfo.label || "camera " + (this.cameras.length + 1),
              code: deviceInfo.deviceId
            });
          } //videoinput
        } //for videoinputs
      } //lambda function
    );

    // Older browsers might not implement mediaDevices at all, so we set an empty object first
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }

    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        // First get ahold of the legacy getUserMedia, if present
        var getUserMedia =
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
          return Promise.reject(
            new Error("getUserMedia is not implemented in this browser")
          );
        }
        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }

    this.loadCamera();
  },
  methods: {
    getVideoObj() {
      return this.$refs.video;
    },
    changeCamera() {
      this.selectedCamera += 1;
      if (this.selectedCamera >= this.cameras.length) this.selectedCamera = 0;
      this.loadCamera(this.selectedCamera);
    },
    loadCamera(cameraIndex = null) {
      const that = this;

      function loadSrcStream(stream) {
        if ("srcObject" in that.getVideoObj()) {
          that.getVideoObj().srcObject = stream;
        } else {
          //old broswers
          that.source = window.URL.createObjectURL(stream);
        }
      }

      if (cameraIndex === null)
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then(stream => loadSrcStream(stream))
          .catch(function(err) {
            console.log(err.name + ": " + err.message);
          });
      else
        navigator.mediaDevices
          .getUserMedia({
            video: { deviceId: { exact: this.cameras[cameraIndex].code } }
          })
          .then(stream => loadSrcStream(stream))
          .catch(function(err) {
            console.log(err.name + ": " + err.message);
          });
    },
    hasMedia() {
      return !!this.getMedia();
    },
    getMedia() {
      return (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia ||
        navigator.oGetUserMedia
      );
    },
    requestMedia() {
      navigator.getUserMedia = this.getMedia();
    },
    capture() {
      if (!this.hasMedia()) {
        this.$emit("notsupported");
        return null;
      }
      return this.getCanvas().toDataURL(this.screenshotFormat);
    },
    getCanvas() {
      let video = this.$refs.video;
      if (!this.ctx) {
        let canvas = document.createElement("canvas");
        canvas.height = video.clientHeight;
        canvas.width = video.clientWidth;
        this.canvas = canvas;

        this.ctx = canvas.getContext("2d");
      }

      const { ctx, canvas } = this;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      return canvas;
    }
  }
};
</script>
