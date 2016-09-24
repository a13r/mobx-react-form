import _ from 'lodash';

/**
  Form Helpers
*/
export default $this => ({

  clearRecursive: (fields) => {
    _.each(fields, (field) => {
      field.clear();
      if (_.has(field, 'fields')) {
        $this.clearRecursive(field.fields);
      }
    });
  },

  resetRecursive: (fields) => {
    _.each(fields, (field) => {
      field.reset();
      if (_.has(field, 'fields')) {
        $this.resetRecursive(field.fields);
      }
    });
  },

  valuesRecursive: fields =>
    _.reduce(fields, (obj, field) => {
      if (_.isObject(field.fields)) {
        return Object.assign(obj, {
          [field.key]: $this.valuesRecursive(field.fields),
        });
      }
      return Object.assign(obj, { [field.key]: field.value });
    }, {}),

  errorsRecursive: fields =>
    _.reduce(fields, (obj, field) => {
      if (_.isObject(field.fields)) {
        return Object.assign(obj, {
          [field.key]: $this.errorsRecursive(field.fields),
        });
      }
      return Object.assign(obj, { [field.key]: field.error });
    }, {}),

  updateRecursive: ($, data, path = '') => {
    const isStrict = ($this.$options.strictUpdate === true);
    const err = 'You are updating a not existent field:';

    _.each(data, ($val, $key) => {
      // get the field by path joining keys recursively
      const field = $this.$(_.trimStart(`${path}.${$key}`, '.'));
      // update values recursively only if field has nested
      if (_.has(field, 'fields')) {
        $this.updateRecursive($, $val, $key, isStrict);
        return;
      }
      // if no field found when is strict update, throw error
      if (_.isUndefined(field) && isStrict) throw new Error(`${err} ${path}`);
      // update field values or others props
      if (!_.isUndefined(field) && $ === 'value') field.update($val);
      if (!_.isUndefined(field) && $ !== 'value') _.set(field, `$${$}`, $val);
    });
  },

});