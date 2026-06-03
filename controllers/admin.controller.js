const getAllPermissionsController = (req, res) => {
    const permissions = [
        {
            label: "View User",
            value: "read_user"
        },
        {
            label: "Create User",
            value: "create_user"
        },
        {
            label: "Update User",
            value: "update_user"
        },
        {
            label: "Delete User",
            value: "delete_user"
        },
    ]
    res.json({
        success: true,
        status_code: 200,
        message: "Permissions retrieved successfully",
        data: permissions
    })
}

module.exports = {
  getAllPermissionsController,
};