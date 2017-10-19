(function () {
    var Ext = window.Ext4 || window.Ext;

    Ext.define("com.ca.technicalservices.Burnupdown.IterationData", {
        alias: "tsiterationdata",

        config: {
            app: undefined
        },

        iterations: {},

        /**
         * Given a data store grouped by Iteration refs, extract the
         * iterations and the capacity sums
         * @param store
         */
        collectIterations: function (store) {
            var iterationGroups = store.getGroups();
            var capacityTotals = store.sum('Capacity', true);

            // Build a map of iteration refs to iteration objects that also contain
            // capacity data
            _.each(iterationGroups, function (group) {

                var iteration = _.clone(group.children[0].data.Iteration);

                // parse date data
                iteration.StartDate = Ext.Date.parse(iteration.StartDate, 'c');
                iteration.EndDate = Ext.Date.parse(iteration.EndDate, 'c');

                // add capacity data
                iteration.capacity = capacityTotals[iteration._ref];
                iteration.dailyCapacity = iteration.capacity / this.workingDayCount(iteration);

                this.iterations[iteration._ref] = iteration;
            }, this);
        },

        workingDayCount: function (iteration) {
                if ( !iteration.StartDate || ! iteration.EndDate ) {
                    // Unexpected, I don't think iterations can be missing these dates
                    Ext.MessageBox.alert("Invalid Iteration", "Iteration " + iteration.Name + " missing StartDate or EndDate");
                    return undefined;
                }

                var count = 0;
                var date = Ext.Date.parse(iteration.StartDate, 'c');
                var endDate = Ext.Date.parse(iteration.EndDate, 'c');
                while ( date <= endDate ) {
                    var day = Ext.Date.format(date, 'l');
                    // TODO (tj) get workdays from calculator or app
                    if (_.contains(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], day) ) {
                        count++;
                    }
                    date = Ext.Date.add(date, Ext.Date.DAY, 1);
                }
                return count;
        },

        // TODO (tj) use Ext.Date.between
        getCapacitiesForDateString: function(dateString) {
            var date = Ext.Date.parse(dateString, 'c');
            var iteration = _.find(this.iterations, function(value) {
                if ( value.StartDate <= date &&
                    value.EndDate >= date ) {
                    return true;
                } else {
                    return false;
                }
            });

            return iteration ? {
                total: iteration.capacity,
                daily: iteration.dailyCapacity
            } : 0;
        }
    });
}());