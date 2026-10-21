const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let inventory = [];

app.get('/api/inventory', (req, res) => {
    res.json(inventory);
});

app.post('/api/inventory/add', (req, res) => {
    const { barcode, code, model, color, quantity } = req.body;
    const existingIndex = inventory.findIndex(item => item.barcode === barcode || (item.code === code && item.color === color));

    if (existingIndex > -1) {
        inventory[existingIndex].quantity += parseInt(quantity);
    } else {
        inventory.push({
            barcode: barcode || 'B-' + Date.now(),
            code,
            model,
            color,
            quantity: parseInt(quantity)
        });
    }
    res.json({ success: true, inventory });
});

app.post('/api/inventory/reduce', (req, res) => {
    const { barcode, code, color, quantity } = req.body;
    const item = inventory.find(item => item.barcode === barcode || (item.code === code && item.color === color));

    if (!item) {
        return res.status(404).json({ success: false, message: 'المنتج غير موجود بالمخزن!' });
    }

    if (item.quantity < parseInt(quantity)) {
        return res.status(400).json({ success: false, message: 'الكمية المتاحة لا تكفي!' });
    }

    item.quantity -= parseInt(quantity);
    res.json({ success: true, inventory });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
});