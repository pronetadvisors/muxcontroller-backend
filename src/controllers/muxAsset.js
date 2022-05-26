const Mux = require('@mux/mux-node');

const uploadAsset = (req, res) => {
	const { accessToken, secret } = req.body;
	// ^^^ WE NEED TO FETCH THESE FROM THE USERS ORGANIZATION
	//TODO - *
	const { Video } = new Mux(accessToken, secret);

};

const createAsset = async (req, res) => {
	const {
		accessToken,
		secret,
		url,
		visibility
	} = req.body;
	const { Video } = new Mux(accessToken, secret);

	const asset = await Video.Assets.create({
		input: url,
		"playback_policy": [
			visibility // Public or Private
		],
	});

	res.send(asset);
};

const deleteAsset = async (req, res) => {
	const {
		accessToken,
		secret,
	} = req.body;
	const assetId = req.params.assetId;
	const { Video } = new Mux(accessToken, secret);

	const result = await Video.Assets.del(assetId);
	res.send(result);
};

// Create playbackId for given assetId
const createAssetPlaybackId = async (req, res) => {
	const {
		accessToken,
		secret,
		visibility,
	} = req.body;
	const assetId = req.params.assetId;
	const { Video } = new Mux(accessToken, secret);

	const playbackId = await Video.Assets.createPlaybackId(assetId, { policy: visibility });
	res.send(playbackId);
};

// Delete playbackId
const deleteAssetPlaybackId = async (req, res) => {
	const {
		accessToken,
		secret,
	} = req.body;
	const assetId = req.params.assetId;
	const playbackId = req.params.playbackId;
	const { Video } = new Mux(accessToken, secret);

	const result = await Video.Assets.deletePlaybackId(assetId, playbackId);
	res.send(result);
};

// Get all assets in Organization
const getAssets = async (req, res) => {
	const {
		accessToken,
		secret,
	} = req.body;
	const { Video } = new Mux(accessToken, secret);

	const assets = Video.Assets.list({ limit: 100, page: 2 });
	res.send(assets);
};

// Get Asset by Id
const getAssetById = async (req, res) => {
	const {
		accessToken,
		secret,
	} = req.body;
	const assetId = req.params.assetId;
	const { Video } = new Mux(accessToken, secret);

	const asset = await Video.Assets.get(assetId);
	res.send(asset);
};

// Get playbackId info
const getAssetPlaybackId = async (req, res) => {
	const {
		accessToken,
		secret,
	} = req.body;
	const assetId = req.params.assetId;
	const playbackId = req.params.playbackId;
	const { Video } = new Mux(accessToken, secret);

	const playbackIdInfo = await Video.Assets.playbackId(assetId, playbackId);
	res.send(playbackIdInfo);
};


export {
	uploadAsset,
	createAsset,
	deleteAsset,
	createAssetPlaybackId,
	deleteAssetPlaybackId,
	getAssets,
	getAssetById,
	getAssetPlaybackId
};