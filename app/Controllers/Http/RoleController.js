'use strict'
const Role = use('App/Models/Role');

class RoleController {
    async getById({ params, auth, response }) {
        const roleId = params.roleId;
        const role = await Role.find(roleId);
        if(role != null){
            return response.status(200).json({
                status: "Success",
                role
            });
        } else {
            return response.status(404).json({
                status: "Error",
                message: "Role not found"
            });
        }
    }

    async getAll({ request, auth, response }){
        const roles = await Role.all();
        return response.status(200).json({
            status: "Success",
            rows: roles.rows.length,
            roles
        });
    }

    async create({ request, auth, response }){
        const { label, description, level } = request.post();
        const role = new Role();
        role.label = label;
        role.description = description;
        role.level = level;
        try{
            await role.save();
            return response.status(201).json({
                status: "Success",
                role
            });
        } catch(e) {
            return response.status(400).json({
                status: "Error",
                message: "An error occured on create Role",
                stack_trace: e
            });
        }
    }

    async update({ request, params, auth, response }){
        const roleId = params.roleId;
        const { label, description, level } = request.post();
        const role = await Role.find(roleId);
        if(role != null){
            role.label = label;
            role.description = description;
            role.level = level;
            try{
                await role.save();
                return response.status(200).json({
                    status: "Update succeed",
                    role
                });
            } catch(e) {
                return response.status(400).json({
                    status: "Error",
                    message: "An error occured on update Role",
                    stack_trace: e
                });
            }
        } else {
            return response.status(404).json({
                status: "Error",
                message: "Role not found",
                stack_trace: e
            });
        }
    }

    async delete({ params, auth, response }){
        const roleId = params.roleId;
        const role = await Role.find(roleId);
        if(role != null){
            try{
                await role.delete();
                return response.status(200).json({
                    status: "Deletion succeed"
                });
            } catch(e) {
                return response.status(400).json({
                    status: "Error",
                    message: "An error occured on delete Role",
                    stack_trace: e
                });
            }
        } else {
            return response.status(404).json({
                status: "Error",
                message: "Role not found",
                stack_trace: e
            });
        }
    }
}

module.exports = RoleController
