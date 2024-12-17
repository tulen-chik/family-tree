const User = require('../models/User');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_jwt_secret'; // В реальном приложении это должно быть в переменных окружения

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Проверяем, существует ли уже пользователь с таким email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Создаем нового пользователя
        const user = new User({ name, email, password });
        await user.save();

        // Создаем токен
        const token = jwt.sign({ _id: user._id }, SECRET_KEY);

        res.status(201).json({ user: { name: user.name, email: user.email }, token });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
        }
        const isPasswordMatch = await user.comparePassword(req.body.password);
        if (!isPasswordMatch) {
            return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
        }
        const token = jwt.sign({ _id: user._id }, SECRET_KEY);
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getProfile = async (req, res) => {
    res.send(req.user);
};

exports.updateProfile = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.updateGenealogy = async (req, res) => {
    try {
        req.user.genealogyTree = req.body.genealogyTree;
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getTree = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ tree: user.genealogyTree });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching genealogy tree', error: error.message });
    }
};

exports.saveTree = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.genealogyTree = req.body.tree;
        await user.save();
        res.json({ message: 'Genealogy tree saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving genealogy tree', error: error.message });
    }
};