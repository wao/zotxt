var EXPORTED_SYMBOLS = [ 'parseEasyKey', 'fixStyleId', 'cleanQuery', 'dedupItems' ];

/**
 * Parses an easy key. Returns {creator: ..., title: ..., date: ...} or null if it
 * did not parse correctly.
 */
function parseEasyKey(key, xregexp) {
    const easyKeyRe = xregexp('^(\\p{Lu}[\\p{Ll}_-]+)(\\p{Lu}\\p{Ll}+)?([0-9]{4})?');
    const alternateEasyKeyRe = xregexp('^([\\p{Ll}_-]+):([0-9]{4})?(\\p{Ll}+)?');
    let result = easyKeyRe.exec(key);
    if (result) {
        return {creator: result[1], title: result[2], date: result[3]};
    } else {
        result = alternateEasyKeyRe.exec(key);
        if (result) {
            return {creator: result[1], title: result[3], date: result[2]};
        } else {
            return null;
        }
    }
}

function fixStyleId(styleId) {
    if (!styleId) {
        return  'http://www.zotero.org/styles/chicago-note-bibliography';
    } else if (!styleId.match(/^http:/)) {
        return 'http://www.zotero.org/styles/' + styleId;
    } else {
        return styleId;
    }
}

/**
 * Prepare query values for us.
 */
function cleanQuery(q) {
    let retval = [];
    for (let key in q) {
        retval[key] = q[key].replace('+', ' ');
    }
    return retval;
}

/* Given a iterable of promises that return an item, return a deduped iterable
 * of promises (based on the id). */
function dedupItems(items, filter) {
    let seenIds = new Set([]); // To uniqify results
    return filter(items, (item) => {
        if (seenIds.has(item.id)) {
            return false;
        } else {
            seenIds.add(item.id);
            return true;
        }
    });
};

if (process) {
    module.exports.fixStyleId = fixStyleId;
    module.exports.parseEasyKey = parseEasyKey;
    module.exports.cleanQuery = cleanQuery;
    module.exports.dedupItems = dedupItems;
}
