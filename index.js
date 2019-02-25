export default class VueZeusWebsockets {
    constructor(config) {
        this.config = config;
        this.websocket = null;
        this.events = {};
        this.timeoutReconnect = null;
        this.callbackOpen = null;

        this.connect();
    }

    install(Vue) {
        Vue.prototype.$socket = this;
    }

    connect() {
        this.websocket = new WebSocket(this.config.connection);

        this.websocket.onopen = () => {
            this.websocket.onmessage = (e) => {
                var data = JSON.parse(e.data);

                if (this.events.hasOwnProperty(data.event)) {
                    for (var fn in this.events[data.event]) {
                        this.events[data.event][fn](data.message);
                    }
                }
            };

            if (this.callbackOpen != null && this.callbackOpen != null) {
                this.callbackOpen();
            }
        }

        this.websocket.onclose = (e) => {
            clearTimeout(this.timeoutReconnect);
            this.timeoutReconnect = setTimeout(() => {
                this.connect();
            }, 1000);
        }
    }

    onConnect(callback) {
        this.callbackOpen = callback;
    }

    join(channel) {
        if (channel === undefined) {
            throw new Error('You must provide a channel');
        }

        var data = {
            action: 'join',
            channel: channel
        };

        this.websocket.send(this.prepareData(data));
    }

    emit(event, message, channel) {
        var data = {
            action: 'message',
            event: event,
            message: message
        };

        if (channel !== undefined) {
            data.channel = channel;
        }

        this.websocket.send(this.prepareData(data));
    }

    listen(event, callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }

        this.events[event] = this.events[event] = [];
        this.events[event].push(callback);
    }

    prepareData(data) {
        return JSON.stringify(data);
    }
}
