<?php
$title = sprintf(__('Block %s'), $block->getName());
$block_limits = $block->getBlockLimits();
$prev = $block->getPrev();
$next = $block->getNext();
$plane = $block->getPlane();
$block_count = $block->count();
$pagination = new Pagination($block_count);
$page = isset($_GET['page'])? intval($_GET['page']) : 1;
$pagination->setPage($page);
$block->slice(($page - 1) * 256, 256);
$cps = $block->get();
$abstract = $block->getAbstract();
$hDescription = sprintf(__('The Unicode block %s contains the codepoints from U+%04X to U+%04X.'),
    $block->getName(), $block_limits[0], $block_limits[1]);
$canonical = $router->getUrl($block);
include "header.php";
$nav = array();
if ($prev) {
    $nav['prev'] = _bl($prev, 'prev', 'min', 'span');
}
$nav["up"] = '<a class="pl" rel="up" href="'.q($router->getUrl($plane)).'">'.q($plane->getName()).'</a>';
if ($next) {
    $nav['next'] = _bl($next, 'next', 'min', 'span');
}
include "nav.php";
?>
<div class="payload block" itemscope="itemscope" itemtype="http://schema.org/Enumeration/Unicode/Block">
  <figure>
    <img src="/static/images/blocks/<?php e(str_replace(' ', '_', $block->getName()))?>.png" alt="<?php _e('Symbol representing this block in the Unidings font')?>" width="128" height="128" itemprop="image" />
  </figure>
  <h1 itemprop="name"><?php e($block->getName());?></h1>
  <p itemprop="description">
     <?php printf(__('Block from U+%04X to U+%04X.'), $block_limits[0], $block_limits[1])?>
     <?php printf(__('This block was introduced in Unicode version %s. It comprises %d codepoints.'), $block->getVersion(), $block_count)?></p>
  <?php if ($abstract):?>
    <p><?php printf(__('The %sWikipedia%s provides the following information on block %s:'), '<a href="http://en.wikipedia.org/wiki/'.q(str_replace(' ', '_', $block)).'_(Unicode_block)">', '</a>', $block->getName())?></p>
    <blockquote cite="http://en.wikipedia.org/wiki/<?php e(str_replace(' ', '_', $block))?>_(Unicode_block)">
        <?php echo strip_tags($abstract, '<p><b><strong class="selflink"><strong><em><i><var><sup><sub><tt><ul><ol><li><samp><small><hr><h2><h3><h4><h5><dfn><dl><dd><dt><u><abbr><big><blockquote><br><center><del><ins><kbd>')?>
    </blockquote>
  <?php endif?>
  <?php if (count($cps) === 0):?>
    <p itemprop="description"><?php printf(__('This block has not defined any codepoints between U+%04X and U+%04X.'), $block_limits[0], $block_limits[1])?></p>
  <?php else:?>
    <p><a href="http://www.unicode.org/charts/PDF/U<?php f('%04X', $block_limits[0])?>.pdf"><?php _e('Chart at Unicode.org')?></a> <?php _e('(PDF)')?><br/>
    <a href="http://decodeunicode.org/<?php e(str_replace(' ', '_', strtolower($block->getName())))?>"><?php _e('Block at Decode Unicode')?></a></p>
    <div class="cp-list" data-page="<?php echo $page?>">
      <?php echo $pagination?>
      <ol class="block data">
        <?php
        $limits = $pagination->getLimits();
        for ($i = $limits[0]; $i < $limits[1]; $i++) {
            if ($i + $block_limits[0] > $block_limits[1]) {
                break;
            }
            if (array_key_exists($i + $block_limits[0], $cps)) {
                echo '<li itemscope="itemscope" itemtype="http://schema.org/StructuredValue/Unicode/CodePoint" value="' . ($i + $block_limits[0]) . '">'; cp($cps[$i + $block_limits[0]]); echo '</li>';
            } else {
                echo '<li class="missing" value="'.($i + $block_limits[0]).'"><span>'.sprintf('%04X', $i + $block_limits[0]).'</span></li>';
            }
        } ?>
      </ol>
      <?php echo $pagination?>
    </div>
  <?php endif?>
</div>
<?php include "footer.php"?>
