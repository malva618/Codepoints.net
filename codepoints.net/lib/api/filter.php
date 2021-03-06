<?php

require_once __DIR__.'/../tools.php';

$maxlength = 1024;
$properties = UnicodeInfo::get()->getAllCategories();

if (! $data) {
    $host = get_origin().'api/v1';
    return array(
        "description" => _("Filter a string of characters by Unicode property. You can negate properties by appending a “!” to it: filter/string?age!=5.5 finds all characters in “string” that were *not* added in Unicode 5.5."),
        "filter_url" => "$host/filter/{data}{?property*}",
        "property" => $properties,
    );
}
if (mb_strlen($data, 'UTF-8') > $maxlength) {
    $api->throwError(API_REQUEST_URI_TOO_LONG, sprintf(_('Request too long: Only %d characters allowed.'), $maxlength));
}

$codepoints = utf8_to_unicode($data);

$sql_filter = array();
$values = array();

foreach ($_GET as $property => $value) {
    if ($property === 'callback') {
        continue;
    }
    $not = "";
    if (substr($property, -1) === '!') {
        $not = ' NOT ';
        $property = substr($property, 0, -1);
    }
    if (! array_key_exists($property, $properties)) {
        $api->throwError(API_BAD_REQUEST,
            sprintf(_('Cannot filter for unknown property %s'), $property));
    }
    $value = (array)$value;
    $column = str_replace('"', '""', $property);
    $sql_filter[] = '"'.$column.'" '.$not.' IN ('.
                    join(',', array_fill(0, count($value), '?')).')';
    $values = array_merge($values, $value);
}

$stm = $api->_db->prepare("SELECT cp FROM codepoints WHERE "
    .join(' AND ', $sql_filter));

if (! $stm) {
    $api->throwError(500, _('Cannot filter.'));
}

$stm->execute($values);
$filtered_cps = $stm->fetchAll(PDO::FETCH_COLUMN, 0);

$codepoints = array_filter($codepoints, function($cp) use ($filtered_cps) {
    return in_array($cp, $filtered_cps);
});

return unicode_to_utf8($codepoints);


#EOF
