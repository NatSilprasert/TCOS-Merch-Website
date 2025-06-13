import userModel from "../models/userModel.js"

// add product to user cart
const addToCart = async (req, res) => {
    try {
        
        const { userId, itemId, size, sizeAvailable } = req.body
       
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found", data});
        }
        let cartData = userData.cartData;

        if (sizeAvailable) {
            if (cartData[itemId]) {
                if (cartData[itemId][size]) {
                    cartData[itemId][size] += 1;
                } else {
                    cartData[itemId][size] = 1;
                }
            } else {
                cartData[itemId] = {};
                cartData[itemId][size] = 1;
            }
        } else {
            if (cartData[itemId]) {
                cartData[itemId] += 1;
            } else {
                cartData[itemId] = 1;
            }
        }

        await userModel.findByIdAndUpdate(userId, {cartData})
        res.json({ success: true, message: "Added To Cart" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// update product to user cart
const updateCart = async (req, res) => {
    try {
        
        const { userId, itemId, size, sizeAvailable, quantity } = req.body

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }
        let cartData = userData.cartData;

        if (sizeAvailable) {
            cartData[itemId][size] = quantity
        }  else {
            cartData[itemId] = quantity
        }

        await userModel.findByIdAndUpdate(userId, {cartData})
        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// get user cart data
const getUserCart = async (req, res) => {
    try {
        
        const { userId } = req.body

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }
        let cartData = userData.cartData;

        res.json({ success: true, cartData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addToCart, updateCart, getUserCart }