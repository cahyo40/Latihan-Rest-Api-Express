const asyncHandler = require('../middleware/async_handle');
const { Profile } = require('../models');


exports.updateOrCreateProfile = asyncHandler(async (req, res) => {
    const { age, bio, address } = req.body;
    const id = req.user.id;

    const userData = await Profile.findOne({
        where: {
            users_id: id
        }
    });

    let message = '';

    if (userData) {
        await Profile.update({
            age: age || userData.age,
            bio: bio || userData.bio,
            address: address || userData.address,
        }, {
            where: {
                users_id: id
            }
        });

        message = 'Profile updated successfully';
    } else {
        await Profile.create({
            age,
            bio,
            address,
            users_id: id
        });

        message = 'Profile created successfully';

    }

    res.status(200).json({
        message
    });

});

exports.uploadImage = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const profileData = await Profile.findOne({
        where: {
            users_id: id
        }
    });

    if (!profileData) {
        throw new Error('Profile not found');
    }
    const file = req.file;
    if (profileData.image) {
        const nameImage = profileData.image.replace(`${req.protocol}://${req.get('host')}/public/uploads/`, '');
        const file_path = `./public/uploads/${nameImage}`;
        fs.unlinkSync(file_path, (err) => {
            res.status(400);
            throw new Error('Image failed to delete');
        });

    }

    if (!file) {
        res.status(400);
        throw new Error('No image file');
    }


    const file_image = file.filename;
    const image_path = `${req.protocol}://${req.get('host')}/public/uploads/${file_image}`;

    await Profile.update({
        image: image_path
    }, {
        where: {
            users_id: id,
        }
    });

    res.status(200).json({
        message: 'Image uploaded successfully'
    });



});