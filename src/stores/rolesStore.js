import { makeAutoObservable } from 'mobx';
import isEmpty from 'is-empty';
import { v4 as uuidv4 } from 'uuid';
import applicationStore from './applicationStore';
import { all, add, role, deleteRol, update } from '../services/roleService';

class RolesStore {
  roles = [];
  currentRole = {
    name: '',
    description: '',
    permissions: [],
  };

  sortBy = [];

  errors = {};
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  resetRoleFields() {
    this.currentRole = {
      name: '',
      description: '',
      permissions: [],
    };
    this.errors = {};
  }

  inputChange(name, value) {
    this.currentRole[name] = value;
    this.errors[name] && delete this.errors[name];
  }

  setIsEditing() {
    this.isEditing = !this.isEditing;
  }

  setRolePermissions(permissions) {
    this.currentRole.permissions = permissions;
  }

  async validateRole() {
    const errors = {};

    if (isEmpty(this.currentRole.name)) errors.name = 'Required';
    if (isEmpty(this.currentRole.description)) errors.description = 'Required';
    if (isEmpty(this.currentRole.permissions)) errors.permissions = 'Required';

    if (isEmpty(errors)) {
      return 'ok';
    } else {
      this.errors = { ...errors };
      return { errors: errors };
    }
  }

  async addNewRole() {
    if (applicationStore.permissions.role?.create) {
      this.loading = true;
      const result = await this.validateRole();
      if (result === 'ok') {
        try {
          const role = { ...this.currentRole };
          role.permissions = this.currentRole.permissions.map((p) => p.id);
          await add(role);
          this.resetRoleFields();
          return 'ok';
        } finally {
          this.loading = false;
        }
      } else {
        this.loading = false;
      }
    }
  }

  async updateRole() {
    if (applicationStore.permissions.role?.modify) {
      this.loading = true;

      const result = await this.validateRole();

      if (result === 'ok') {
        try {
          const role = this.currentRole;
          role.permissions = this.currentRole.permissions.map((p) => p.id);
          await update(this.currentRole.id, role);
          this.resetRoleFields();
          return 'ok';
        } finally {
          this.loading = false;
        }
      } else {
        this.loading = false;
      }
    }
  }

  addUniqId(data) {
    return data.map((el) => ({ ...el, actionId: uuidv4() }));
  }

  async getAllRoles() {
    if (applicationStore.permissions.role?.view) {
      this.loading = true;
      try {
        const roles = await all();

        this.roles = this.addUniqId(roles);
      } finally {
        this.loading = false;
      }
    }
  }

  async getRole(id) {
    if (applicationStore.permissions.role?.view) {
      this.loading = true;
      try {
        const response = await role(id);
        this.currentRole = response;

        if (response.permissions.length > 0) {
          this.currentRole.permissions = response.permissions.map((perm) => ({
            label: `${perm.resource}/${perm.action}`,
            value: +perm.id,
            ...perm,
          }));
        } else {
          this.currentRole.permissions = [];
        }

        return 'ok';
      } finally {
        this.loading = false;
      }
    }
  }

  async deleteRole(id) {
    if (applicationStore.permissions.role?.delete) {
      this.loading = true;
      try {
        await deleteRol(id);
        await this.getAllRoles();
      } finally {
        this.loading = false;
      }
    }
  }

  get rolesLength() {
    return this.roles.length;
  }

  get rolesData() {
    return this.roles || [];
  }
}

export default new RolesStore();
