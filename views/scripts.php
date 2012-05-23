<?php
$title = 'Scripts';
$hDescription = 'Browse Codepoints.net by script';
$headdata = '
    <style type="text/css">

svg {
  pointer-events: all;
}

circle {
  fill: #dbe4f0;
  fill: #b5cbe8;
}

path {
  fill: #aaa;
  stroke: #000;
  stroke-width: .33px;
  cursor: pointer;
  transition-property: fill;
  transition-duration: .5s;
}

path:hover {
  fill: #DDD;
}

path.active {
  fill: #f44;
  stroke: #600
}

#sclist dd + dt {
  margin-top: 0;
}

#sclist dd {
  font-size: 12px;
}

#sclist a {
  color: #880000;
}

#sclist dt a {
  border-bottom: none;
}

    </style>
    ';
include 'header.php';
include 'nav.php';
?>
<div class="payload static script">
  <h1>Browse Codepoints by Script</h1>
  <section id="space" class="bk">
    <p>Scripts used around the world. Drag the globe to rotate it.
       Click on a country to see scripts used there.</p>
    <svg xmlns="http://www.w3.org/2000/svg" id="earth"
         width="100%" viewBox="0 0 800 800">
      <defs>
        <radialGradient id="reflect"
          r="75%" cx="35%" cy="20%">
          <stop stop-color="white" stop-opacity=".67" offset="0" />
          <stop stop-color="white" stop-opacity="0.0" offset=".3" />
          <stop stop-color="white" stop-opacity="0.0" offset=".8" />
          <stop stop-color="black" stop-opacity="0.2" offset="1" />
        </radialGradient>
      </defs>
      <circle cx="50%" cy="50%" r="50%" style="cursor: move" />
      <circle id="athmo" cx="50%" cy="50%" r="50%" style="pointer-events: none; fill: url(#reflect)" />
    </svg>
  </section>
  <section class="bk">
    <dl id="sclist">
      <?php foreach ($scripts as $sc): ?>
        <dt data-sc="<?php e($sc['iso'])?>" class="sc_<?php e($sc['iso'])?>"><a href="#"><?php e($sc['name'])?></a></dt>
        <dd>
          <p>Unicode has <a href="/search?sc=<?php e($sc['iso'])?>"><?php e($sc['count'])?> characters</a> encoded in this script.</p>
        </dd>
      <?php endforeach?>
    </dl>
  </section>
</div>
<?php
$footer_scripts = array(
    '/static/js/d3.js',
    '/static/js/d3.geo.js',
    '/static/js/scripts.js',
);
include 'footer.php'?>
