const Mux = require('@mux/mux-node');

const createStream = async (req, res) => {
    const {
        accessToken,
        secret,
        visibility
    } = req.body;
    const { Video } = new Mux(accessToken, secret);

    const LiveStream = await Video.LiveStreams.create({
        "playback_policy": visibility,
        new_asset_settings: { playback_policy: visibility }
    });

    res.send(LiveStream);
}

const deleteStream = async (req, res) => {
    const {
        accessToken,
        secret,
    } = req.body;
    const streamId = req.params.streamId;
    const { Video } = new Mux(accessToken, secret);

    const result = await Video.LiveStreams.del(streamId);
    res.send(result);
}

// Create playbackId for given StreamId
const createStreamPlaybackId = async (req, res) => {
    const {
        accessToken,
        secret,
        visibility,
    } = req.body;
    const streamId = req.params.streamId;
    const { Video } = new Mux(accessToken, secret);

    const playbackId = await Video.LiveStreams.createPlaybackId(streamId, { policy: visibility });
    res.send(playbackId);
}

// Delete playbackId
const deleteStreamPlaybackId = async (req, res) => {
    const {
        accessToken,
        secret,
    } = req.body;
    const streamId = req.params.streamId;
    const playbackId = req.params.playbackId;
    const { Video } = new Mux(accessToken, secret);

    const result = await Video.LiveStreams.deletePlaybackId(streamId, playbackId);
    res.send(result);
}

// Get all LiveStreams in Organization
const getStreams = async (req, res) => {
    const {
        accessToken,
        secret,
    } = req.body;
    const { Video } = new Mux(accessToken, secret);

    const streams = Video.LiveStreams.list({ limit: 100, page: 2 });
    res.send(streams);
}

// Get Stream by Id
const getStreamById = async (req, res) => {
    const {
        accessToken,
        secret,
    } = req.body;
    const streamId = req.params.streamId;
    const { Video } = new Mux(accessToken, secret);

    const stream = await Video.LiveStreams.get(streamId);
    res.send(stream);
}

// reset streamKey
const resetStreamKey = async (req, res) => {
    const {
        accessToken,
        secret,
    } = req.body;
    const streamId = req.params.streamId;
    const { Video } = new Mux(accessToken, secret);

    const streamKey = await Video.LiveStreams.resetStreamKey(streamId);
    res.send(streamKey);
}

// Enable Stream
const enableStream = async (req, res) => {
    const {
        accessToken,
        secret,
    } = req.body;
    const streamId = req.params.streamId;
    const { Video } = new Mux(accessToken, secret);

    const result = await Video.LiveStreams.enable(streamId);
    res.send(result);
}

// Disable Stream
const disableStream = async (req, res) => {
    const {
        accessToken,
        secret,
    } = req.body;
    const streamId = req.params.streamId;
    const { Video } = new Mux(accessToken, secret);

    const result = await Video.LiveStreams.disable(streamId);
    res.send(result);
}

// Mark Stream complete
const completeStream = async (req, res) => {
    const {
        accessToken,
        secret,
    } = req.body;
    const streamId = req.params.streamId;
    const { Video } = new Mux(accessToken, secret);

    const result = await Video.LiveStreams.signalComplete(streamId);
    res.send(result);
}

export {
    createStream,
    deleteStream,
    createStreamPlaybackId,
    deleteStreamPlaybackId,
    getStreams,
    getStreamById,
    resetStreamKey,
    enableStream,
    disableStream,
    completeStream
}