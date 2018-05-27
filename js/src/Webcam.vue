<template>
    <div id="webcam-view">
        <div class="select">
            <label for="videoSource">Video source: </label>
            <select id="videoSources">@change="handleChange"
                <option v-for="selectValue in cameras" :key="selectValue.code" :value="selectValue.code">{{ selectValue.name }}</option>
            </select>
        </div>
        <video ref="video" v-bind:width="width" v-bind:height="height" :src="this.source" autoplay="true"></video>
    </div>  
</template>

<script>
export default {
    data () {
        return {
            stream: '',
            source: '',
            canvas: null,
            cameras: [],
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
          default: 'image/jpeg'
        }
    },
    mounted() {
        if (!this.hasMedia()) {
            this.$emit('notsupported');
            return;
        }

        navigator.mediaDevices.enumerateDevices().then(deviceInfos =>{
            for (var i = 0; i !== deviceInfos.length; ++i) {
                var deviceInfo = deviceInfos[i];
                if (deviceInfo.kind === 'videoinput') {
                    this.cameras.push({name: deviceInfo.label || 'camera ' +
                    (this.cameras.length + 1), code: deviceInfo.deviceId});
                }//videoinput
            }//for videoinputs
        }//lambda function
        );

// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {
    // First get ahold of the legacy getUserMedia, if present
    var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }
    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}

//console.dir(this.cameras.child(0));

const that = this;


//navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: "EFWjQzJg08sJdkgrFGsr1zxWiCyxrTt0PBkmcagnHnQ=" } } })
navigator.mediaDevices.getUserMedia({ video: true })
.then(function(stream) {
  if ("srcObject" in that.getVideoObj()) {
    that.getVideoObj().srcObject = stream;
  } else {//old broswers
    that.source = window.URL.createObjectURL(stream);
  }
  that.stream = stream;
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});



    },
    methods: {
        getVideoObj(){
            return this.$refs.video;
        },
        hasMedia() {
            return !!this.getMedia();
        },
        getMedia() {
            return (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia);
        },
        requestMedia() {
            navigator.getUserMedia = this.getMedia();
        },
        capture() {
            if (!this.hasMedia()) {
                this.$emit('notsupported');
                return null;
            }
            return this.getCanvas().toDataURL(this.screenshotFormat);
        },
        getCanvas() {
            let video = this.$refs.video;
            if (!this.ctx) {
                let canvas = document.createElement('canvas');
                canvas.height = video.clientHeight;
                canvas.width = video.clientWidth;
                this.canvas = canvas;

                this.ctx = canvas.getContext('2d');
            }

            const { ctx, canvas } = this;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            return canvas;
        }
    }
}
</script>
