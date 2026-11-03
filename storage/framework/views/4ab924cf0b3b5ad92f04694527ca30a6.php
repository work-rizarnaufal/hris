<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia><?php echo e(config('app.name', 'HCGA Attendance')); ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">
    <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/app.jsx']); ?>
    <?php if (!isset($__inertiaSsrDispatched)) { $__inertiaSsrDispatched = true; $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page); }  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->head; } ?>
</head>
<body class="antialiased">
    <?php if (!isset($__inertiaSsrDispatched)) { $__inertiaSsrDispatched = true; $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page); }  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->body; } elseif (config('inertia.use_script_element_for_initial_page')) { ?><script data-page="app" type="application/json"><?php echo json_encode($page, JSON_HEX_TAG); ?></script><div id="app"></div><?php } else { ?><div id="app" data-page="<?php echo e(json_encode($page)); ?>"></div><?php } ?>
</body>
</html>
<?php /**PATH D:\Rizar\PROJECT\hris\resources\views/app.blade.php ENDPATH**/ ?>