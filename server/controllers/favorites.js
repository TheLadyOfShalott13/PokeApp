import Favorites from "../models/Favorites.js";


//================= Add a favorite pokemon =======================//
export const addFavorite = async (req, res, next) => {
    const newFavorite = new Favorites(req.body)

    try {
        const savedFavorite = await newFavorite.save();
        res.status(200).json(savedFavorite);
    }
    catch (err) {
        next(err)
    }
}

//================= Add a favorite pokemon =======================//
export const isFavorite = async (req, res, next) => {
    try {
        const result = await Favorites.findAll({
            where: {
                user_id: req.body.user_id,
                poke_id: req.body.poke_id
            }
        });
        const checkFavorite = { favorite_status: (result.length > 0)};
        res.status(200).json(checkFavorite);
    }
    catch (err) {
        next(err)
    }
}


//================= Unfavorite a pokemon =======================//
export const deleteFavorite = async (req, res, next) => {
    try {
        await Favorites.destroy( {
            where: {
                poke_id: req.body.poke_id,
                user_id: req.body.user_id
            }
        });
        res.status(200).json({
            "status": "success",
            "deleted_resource": {
                poke_id: req.body.poke_id,
                user_id: req.body.user_id
            }
        });
    } catch (err) {
        next(err);
    }
};


//================= List all the user's favorite pokemons =======================//
export const getAllFavorites = async (req, res, next) => {
    try {
        const favorites = await Favorites.findAll({
            where: { user_id: req.params.user_id }});
        res.status(200).json(favorites);
    } catch (err) {
        next(err)
    }
}