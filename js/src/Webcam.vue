<template>
    <div id="webcam-view">
        <div class="select">
            <label for="videoSource">Video source: </label>
            <select id="videoSources">@change="handleChange"
                <option v-for="selectValue in cameras" :value="selectValue.code">{{ selectValue.name }}</option>
            </select>
        </div>
        <video ref="video" v-bind:width="width" v-bind:height="height" v-bind:src="source" v-bind:autoplay="true"></video>
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

        this.getMedia().enumerateDevices().then(deviceInfos =>{
            for (var i = 0; i !== deviceInfos.length; ++i) {
                var deviceInfo = deviceInfos[i];
                if (deviceInfo.kind === 'videoinput') {
                    this.cameras.push({name: deviceInfo.label || 'camera ' +
                    (this.cameras.length + 1), code: i});
                }//videoinput
            }//for videoinputs
        }//lambda function
        );

        if (this.cameras.length != 0) {
            this.getMedia().getUserMedia({ video: {exact: 1} }, stream => {
            this.source = stream;
            this.stream = stream;
            this.$emit('started', stream);
        }, error => {
            this.$emit('error', error);
          });
        }
    },
    methods: {
        hasMedia() {
            return !!this.getMedia();
        },
        getMedia() {
            return (navigator.mediaDevices || navigator.webkitGetUserMedia || navigator.oGetUserMedia);
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
