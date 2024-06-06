import { action, makeAutoObservable } from 'mobx';
import isEmpty from 'is-empty';
import referenceStore from './referenceStore';
import applicationStore from './applicationStore';
import ErrorModal from '../components/Common/ErrorModal';
import InviteResultModal from '../components/Common/InviteResultModal';
import {
  all,
  add,
  getUserById,
  deleteUser,
  update,
  verify,
  sync,
} from '../services/userService';

class UsersStore {
  allUsers = [];
  currentUser = {
    authorizedApplications: [],
    email: '',
    emailVerified: false,
    isSyncRequired: false,
    organization: {},
    roles: [],
    effectivePermissions: [],
  };

  users = {
    items: [],
    total: undefined,
    take: 15,
    skip: 0,
    withTotal: true,
  };

  loading = false;
  sendingInvite = false;
  updatingRoles = false;
  searchInputVal = '';
  errors = {};
  sortBy = [];
  sortQueries = undefined;

  constructor() {
    makeAutoObservable(this, {
      validateUser: action.bound,
      addNewUser: action.bound,
      pageChange: action.bound,
    });
  }

  inputChange(name, value) {
    this.currentUser[name] = value;
    this.errors[name] && delete this.errors[name];
  }

  setUserOrg(org) {
    this.currentUser.organization = org;
    this.errors.organization && delete this.errors.organization;
  }

  setUserAuthApps(apps) {
    this.currentUser.authorizedApplications = apps;
    this.errors.authorizedApplications &&
      delete this.errors.authorizedApplications;
  }

  setUserRoles(r) {
    this.currentUser.roles = r;
    this.errors.roles && delete this.errors.roles;
  }

  resetUserFields() {
    this.currentUser = {
      fullName: '',
      email: '',
      password: '',
      emailVerified: false,
      organization: null,
    };
    this.errors = {};
  }

  resetSearchInputField() {
    this.searchInputVal = '';
  }

  sort(fields) {
    this.sortBy = fields;
    const sortQueries = {};

    fields.forEach((obj, index) => {
      sortQueries[`order[${index}].name`] = obj.field;
      sortQueries[`order[${index}].direction`] = obj.dir;
    });

    this.sortQueries = sortQueries;

    this.getAllUsers();
  }

  async getAllUsers() {
    if (applicationStore.permissions.user?.view) {
      this.loading = true;
      try {
        let queries = {
          skip: this.users.skip,
          take: this.users.take,
          withTotal: true,
        };

        if (this.sortQueries) {
          queries = { ...queries, ...this.sortQueries };
        }

        if (this.searchInputVal) {
          queries = { ...queries, text: this.searchInputVal };
        }

        const response = await all(queries);

        this.users.items = response.items;
        this.users.total = response.total;
        this.allUsers = response.items;
      } catch (e) {
        ErrorModal(e?.response?.message);
      } finally {
        this.loading = false;
      }
    }
  }

  pageChange(take, skip) {
    this.users.take = take;
    this.users.skip = skip;

    this.getAllUsers();
  }

  async validateUser() {
    const errors = {};

    if (isEmpty(this.currentUser.fullName)) errors.fullName = 'Required';
    if (isEmpty(this.currentUser.email)) errors.email = 'Required';
    if (!this.currentUser.organization) errors.organization = 'Required';
    if (isEmpty(this.currentUser.authorizedApplications))
      errors.authorizedApplications = 'Required';
    if (isEmpty(this.currentUser.roles)) errors.roles = 'Required';

    if (isEmpty(errors)) {
      return 'ok';
    } else {
      this.errors = { ...errors };
      return { errors: errors };
    }
  }

  async search(value) {
    if (applicationStore.permissions.user?.view) {
      this.searchInputVal = value;
      this.getAllUsers();
    }
  }

  async addNewUser() {
    if (applicationStore.permissions.user?.create) {
      this.loading = true;

      const result = await this.validateUser();

      if (result === 'ok') {
        try {
          const user = {
            email: this.currentUser.email,
            emailVerified: this.currentUser.emailVerified,
            fullName: this.currentUser.fullName,
            organization: this.currentUser.organization?.code || null,
            // organizationType: this.currentUser.organization.type,
            roles: this.currentUser.roles
              ? [...new Set(this.currentUser.roles)].map((r) => r.id)
              : [],
            authorizedApplications: this.currentUser.authorizedApplications
              ? [
                  ...this.currentUser.authorizedApplications.map(
                    (a) => a.externalId,
                  ),
                ]
              : [],
          };

          await add(user);

          this.resetSearchInputField();
          this.resetUserFields();

          return 'ok';
        } catch (e) {
          if (e.response?.data) {
            const { email } = e.response.data;
            if (email) {
              if (email[0] !== 'The user already exists.') {
                this.errors.email = 'Not valid email format';
              } else {
                this.errors.email = email[0];
              }
            }
          } else {
            ErrorModal(e?.response?.message);
          }
        } finally {
          this.loading = false;
        }
      } else {
        this.loading = false;
      }
    }
  }

  async updateUser() {
    if (applicationStore.permissions.user?.modify) {
      this.loading = true;
      const result = await this.validateUser();
      if (result === 'ok') {
        try {
          const user = {
            email: this.currentUser.email,
            emailVerified: this.currentUser.emailVerified,
            fullName: this.currentUser.fullName,
            organization: this.currentUser.organization?.code || null,
            // organizationType: this.currentUser.organization.type,
            roles: this.currentUser.roles
              ? [...new Set(this.currentUser.roles)].map((r) => r.id)
              : [],
            authorizedApplications: this.currentUser.authorizedApplications
              ? [
                  ...this.currentUser.authorizedApplications.map(
                    (a) => a.externalId,
                  ),
                ]
              : [],
            updateRoles: true,
            updateApplications: true,
          };

          await update(this.currentUser.id, user);

          this.resetSearchInputField();
          this.resetUserFields();

          return 'ok';
        } catch (e) {
          if (e.response?.data) {
            const { email } = e.response.data;
            if (email) {
              this.errors.email = 'Not valid email format';
            } else {
              ErrorModal(e?.response?.message);
            }
          }
        } finally {
          this.loading = false;
        }
      } else {
        this.loading = false;
      }
    }
  }

  async updateUserRoles() {
    if (applicationStore.permissions.user?.modify) {
      this.updatingRoles = true;

      try {
        const user = {
          email: this.currentUser.email,
          emailVerified: this.currentUser.emailVerified,
          fullName: this.currentUser.fullName,
          organization: this.currentUser.organization?.code || null,
          // organizationType: this.currentUser.organization.type,
          roles: this.currentUser.roles
            ? [...new Set(this.currentUser.roles)].map((r) => r.id)
            : [],
          authorizedApplications: this.currentUser.authorizedApplications
            ? [
                ...this.currentUser.authorizedApplications.map(
                  (a) => a.externalId,
                ),
              ]
            : [],
          updateRoles: true,
          updateApplications: false,
        };

        const response = await update(this.currentUser.id, user);

        this.currentUser.roles = response.roles.map((r) => ({
          ...r,
          label: r.name,
          value: +r.id,
        }));

        const permsArray = this.currentUser.roles.map(
          (role) => role.permissions,
        );
        const allPerms = [].concat.apply([], permsArray);
        const setOfPerms = new Set();

        this.currentUser.effectivePermissions = allPerms.reduce((acc, item) => {
          if (!setOfPerms.has(+item.id)) {
            setOfPerms.add(+item.id, item);
            acc.push(item);
          }
          return acc;
        }, []);
      } catch (e) {
        if (e.response?.data) ErrorModal(e.response?.data?.message);
      } finally {
        this.updatingRoles = false;
      }
    }
  }

  async deleteUser(id) {
    if (applicationStore.permissions.user?.delete) {
      this.loading = true;
      try {
        this.resetSearchInputField();
        await deleteUser(id);
        await this.getAllUsers();
      } finally {
        this.loading = false;
      }
    }
  }

  async getUser(id) {
    if (applicationStore.permissions.user?.view) {
      try {
        this.loading = true;

        const user = await getUserById(id);

        this.currentUser = user;

        this.currentUser.organization = {
          label: user.organization.name,
          value: user.organization.code,
          ...user.organization,
        };

        if (user.authorizedApplications.length > 0) {
          if (!referenceStore.apps) await referenceStore.getApps();
          this.currentUser.authorizedApplications = referenceStore.apps
            .filter((app) =>
              user.authorizedApplications.includes(app.externalId),
            )
            .map((app, i) => ({
              key: i,
              label: app.name,
              value: app.code,
              ...app,
            }));
        } else {
          this.currentUser.authorizedApplications = [];
        }

        this.currentUser.roles = user.roles.map((r) => ({
          ...r,
          label: r.name,
          value: +r.id,
        }));

        this.currentUser.effectivePermissions = user.effectivePermissions;

        return 'ok';
      } finally {
        this.loading = false;
      }
    }
  }

  async sendInvite(id) {
    if (applicationStore.permissions.user?.verify) {
      this.sendingInvite = true;
      try {
        await verify(id);
        this.getAllUsers();
        InviteResultModal({ result: 'success' });
      } catch (e) {
        InviteResultModal({ result: 'failed' });
      } finally {
        this.sendingInvite = false;
      }
    }
  }

  async syncUsers() {
    if (applicationStore.permissions.user?.view) {
      this.loading = true;
      try {
        await sync();
        await all();
      } finally {
        this.loading = false;
      }
    }
  }

  get usersLength() {
    return this.users.items.length;
  }

  get notSyncedUsers() {
    return this.allUsers.filter((user) => user.isSyncRequired).length;
  }
}

export default new UsersStore();
