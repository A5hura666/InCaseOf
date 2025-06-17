const Locker = require('../models/Locker');


exports.postLocker = async (req, res) => {
    try {
        const { lockerNumber, lockerSize, lockerPrice } = req.body;

        if (!lockerNumber || !lockerSize || !lockerPrice) {
            return res.status(400).json({ error: "Tous les champs sont requis." });
        }

        const existingLocker = await Locker.findOne({ lockerNumber });
        if (existingLocker) {
            return res.status(400).json({ error: "Ce numéro de casier est déjà pris." });
        }

        const newLocker = new Locker({ lockerNumber, lockerSize, lockerPrice });
        const registeredLocker = await newLocker.save();
        res.status(201).json(registeredLocker);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur lors de la création du casier." });
    }
};

exports.getLockers = async (req, res) => {
    try{
       const lockers = await Locker.find();
        const sortedGrid = sortLockers(lockers);
        res.render('lockers/lockers-list', {
            title: 'Liste des casiers',
            lockers: sortedGrid,
        });

    }catch (err) {
        res.status(400).json({error: err});
    }
}

exports.getLockerById = async (req, res) => {
    try{
        const locker = await Locker.findById(req.params.id);
        res.status(200).json(locker);
    }catch (err) {
        res.status(400).json({error: err});
    }
}

exports.updateLocker = async (req, res) => {
    try{
        const updatedLocker = await Locker.findByIdAndUpdate
        (req.params.id, req.body, {new: true});
        res.status(200).json(updatedLocker);
    }catch (err) {
        res.status(400).json({error: err});
    }
}

exports.updateLocker = async (req, res) => {
    try {
        const { lockerNumber } = req.body;
        const lockerId = req.params.id;

        const existingLocker = await Locker.findOne({
            lockerNumber,
            _id: { $ne: lockerId }
        });

        if (existingLocker) {
            return res.status(400).json({ error: "Ce numéro de casier est déjà utilisé." });
        }

        const updatedLocker = await Locker.findByIdAndUpdate(lockerId, req.body, { new: true });

        res.status(200).json(updatedLocker);
    } catch (err) {
        res.status(400).json({ error: err.message || 'Erreur serveur' });
    }
};

exports.deleteLocker = async (req, res) => {
    try{
        const deletedLocker = await Locker.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedLocker);
    }catch (err) {
        res.status(400).json({error: err});
    }
}

function sortLockers(lockers) {
    // Sort lockers by size: large -> medium -> small
    lockers.sort((a, b) => {
        const sizeOrder = { large: 3, medium: 2, small: 1 };
        return sizeOrder[b.lockerSize] - sizeOrder[a.lockerSize];
    });

    const grid = [];
    const gridCols = 4; // Number of columns in the grid
    let currentRow = 0;

    lockers.forEach((locker) => {
        const colSpan = locker.lockerSize === 'large' ? 2 : 1;
        const rowSpan = locker.lockerSize === 'large' ? 2 : locker.lockerSize === 'medium' ? 2 : 1;

        // Find the next available position in the grid
        let placed = false;
        for (let row = currentRow; !placed; row++) {
            for (let col = 0; col < gridCols; col++) {
                if (canPlaceLocker(grid, row, col, colSpan, rowSpan, gridCols)) {
                    placeLocker(grid, row, col, colSpan, rowSpan, locker);
                    placed = true;
                    currentRow = Math.max(currentRow, row); // Update current row
                    break;
                }
            }
        }
    });

    return grid;
}

function canPlaceLocker(grid, row, col, colSpan, rowSpan, gridCols) {
    // Check if locker can fit in the specified position
    for (let r = row; r < row + rowSpan; r++) {
        for (let c = col; c < col + colSpan; c++) {
            if (c >= gridCols || (grid[r] && grid[r][c])) {
                return false;
            }
        }
    }
    return true;
}

function placeLocker(grid, row, col, colSpan, rowSpan, locker) {
    for (let r = row; r < row + rowSpan; r++) {
        if (!grid[r]) grid[r] = [];
        for (let c = col; c < col + colSpan; c++) {
            grid[r][c] = {
                locker: locker,
                start: (r === row && c === col), // true uniquement pour la première cellule du casier
                colSpan: colSpan,
                rowSpan: rowSpan
            };
        }
    }
}
