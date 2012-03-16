<?php


function __autoload($class) {
    require_once 'lib/' . strtolower($class) . '.class.php';
}


$db = new PDO('sqlite:'.dirname(__FILE__).'/ucd.sqlite');
$router = Router::getRouter();


$router->addSetting('db', $db)

->registerAction(function ($url, $o) {
    // Planes
    if (substr($url, -6) === '_plane') {
        try {
            $plane = new UnicodePlane($url, $o['db']);
        } catch(Exception $e) {
            try {
                $plane = new UnicodePlane(substr($url, 0, -6), $o['db']);
            } catch(Exception $e) {
                return False;
            }
        }
        return $plane;
    }
    return False;
}, function($request) {
    $plane = $request->data;
    $view = new View('plane.html');
    echo $view->render(compact('plane'));
})

->registerAction(function ($url, $o) {
    // Codepoints
    if (substr($url, 0, 2) === 'U+' && ctype_xdigit(substr($url, 2))) {
        try {
            $codepoint = new Codepoint(hexdec(substr($url, 2)), $o['db']);
            $codepoint->getName();
        } catch (Exception $e) {
            return False;
        }
        return $codepoint;
    }
    return False;
}, function ($request, $o) {
    $info = UnicodeInfo::get();
    $view = new View('codepoint.html');
    echo $view->render(array(
        'info' => $info,
        'codepoint' => $request->data));
})

->registerAction(function ($url, $o) {
    // Blocks
    if (! preg_match('/[^a-z0-9_-]/', $url)) {
        try {
            $block = new UnicodeBlock($url, $o['db']);
        } catch(Exception $e) {
            return False;
        }
        return $block;
    }
    return False;
}, function($request) {
    $block = $request->data;
    $view = new View('block.html');
    echo $view->render(compact('block'));
})

->registerAction(function ($url) {
    // Search
    return ($url === 'search' || substr($url, 0, 7) === 'search?');
}, function ($request, $o) {
    $router = Router::getRouter();
    $result = new SearchResult(array(), $o['db']);
    $info = UnicodeInfo::get();
    $cats = $info->getCategoryKeys();
    foreach ($_GET as $k => $v) {
        if (in_array($k, $cats)) {
            $result->addQuery($k, $v);
        }
    }
    $page = isset($_GET['page'])? intval($_GET['page']) : 1;
    $result->page = $page - 1;
    $result->search();
    if ($result->getCount() === 1) {
        $cp = $result->get();
        $router->redirect('U+'.next($cp));
    }
    $pagination = new Pagination($result->getCount(), 128);
    $pagination->setPage($page);
    $view = new View('search');
    echo $view->render(compact('result', 'pagination', 'page'));
})

->registerAction(array('', 'index.php'),
function ($request, $o) {
    $view = new View('front');
    echo $view->render(array('planes' => UnicodePlane::getAll($o['db'])));
});

$router->registerUrl('Codepoint', function ($object) {
    return sprintf("U+%s", $object->getId('hex'));
})
->registerUrl('UnicodeBlock', function ($object) {
    return str_replace(' ', '_', strtolower($object->getName()));
})
->registerUrl('UnicodePlane', function ($object) {
    $path = str_replace(' ', '_', strtolower($object->getName()));
    if (substr($path, -6) !== '_plane') {
        $path .= '_plane';
    }
    return $path;
})
->registerUrl('SearchResult', function ($object) {
    $path = 'search';
    if ($object instanceof SearchResult) {
        $q = $object->getQuery;
        $path .= http_build_query($q);
    }
    return $path;
});


if ($router->callAction() === False) {
    header('HTTP/1.0 404 Not Found');
    $view = new View('error404');
    echo $view->render(array('planes' => UnicodePlane::getAll($db)));
}


// __END__
