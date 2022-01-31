exports.home = (req, res) => {
    res.status(200).json({
        success: true,
        greeting : "hello from home API"
    });
};



exports.homedummy = (req, res) => {
    res.status(200).json({
        success: true,
        greeting : "hello from homeDummy controller API"
    });
};