const cvService = require('../services/cvService');
const { validationResult } = require('express-validator');

class CVController {
    async getCV(req, res) {
        try {
            const cv = await cvService.getCV(req.sessionId);

            res.json({
                success: true,
                data: cv
            });
        } catch (error) {
            console.error('Get CV error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve CV'
            });
        }
    }
    async saveCV(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const validationErrors = cvService.validateCVData(req.body);
            if (validationErrors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'CV validation failed',
                    errors: validationErrors
                });
            }

            const cv = await cvService.saveCV(req.sessionId, req.body);

            res.json({
                success: true,
                message: 'CV saved successfully',
                data: cv
            });
        } catch (error) {
            console.error('Save CV error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to save CV'
            });
        }
    }
    async updateSection(req, res) {
        try {
            const { section } = req.params;
            const sectionData = req.body;

            const cv = await cvService.updateCVSection(req.sessionId, section, sectionData);

            res.json({
                success: true,
                message: `${section} updated successfully`,
                data: cv
            });
        } catch (error) {
            console.error('Update section error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update section'
            });
        }
    }
    async addToSection(req, res) {
        try {
            const { section } = req.params;
            const itemData = req.body;

            const newItem = await cvService.addToSection(req.sessionId, section, itemData);

            res.status(201).json({
                success: true,
                message: `Item added to ${section} successfully`,
                data: newItem
            });
        } catch (error) {
            console.error('Add to section error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to add item'
            });
        }
    }
    async updateSectionItem(req, res) {
        try {
            const { section, itemId } = req.params;
            const updateData = req.body;

            const updatedItem = await cvService.updateSectionItem(req.sessionId, section, itemId, updateData);

            res.json({
                success: true,
                message: 'Item updated successfully',
                data: updatedItem
            });
        } catch (error) {
            console.error('Update section item error:', error);

            if (error.message === 'CV or section not found' || error.message === 'Item not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to update item'
            });
        }
    }
    async removeFromSection(req, res) {
        try {
            const { section, itemId } = req.params;

            await cvService.removeFromSection(req.sessionId, section, itemId);

            res.json({
                success: true,
                message: 'Item removed successfully'
            });
        } catch (error) {
            console.error('Remove from section error:', error);

            if (error.message === 'CV or section not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to remove item'
            });
        }
    }
    async deleteCV(req, res) {
        try {
            await cvService.deleteCV(req.sessionId);

            res.json({
                success: true,
                message: 'CV deleted successfully'
            });
        } catch (error) {
            console.error('Delete CV error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete CV'
            });
        }
    }
    async getTemplate(req, res) {
        try {
            const template = cvService.getEmptyCVTemplate();

            res.json({
                success: true,
                data: template
            });
        } catch (error) {
            console.error('Get template error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get template'
            });
        }
    }
}

module.exports = new CVController();