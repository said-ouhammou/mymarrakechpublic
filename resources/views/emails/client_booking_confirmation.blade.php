<!DOCTYPE html>
<html lang="fr-FR">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>My Marrakech</title>
    <style type="text/css">@media screen and (max-width: 600px){#header_wrapper{padding: 27px 36px !important; font-size: 24px;}#body_content table > tbody > tr > td{padding: 10px !important;}#body_content_inner{font-size: 10px !important;}}</style>
</head>
<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="background-color: #f7f7f7; padding: 0; text-align: center;">
    <table width="100%" id="outer_wrapper" style="background-color: #f7f7f7;">
        <tr>
            <td></td>
            <td width="600">
                <div id="wrapper" dir="ltr" style="margin: 0 auto; padding: 70px 0; width: 100%; max-width: 600px; -webkit-text-size-adjust: none;" width="100%">
                    <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%">
                        <tr>
                            <td align="center" valign="top">
                                <div id="template_header_image"></div>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" id="template_container" style="background-color: #fff; border: 1px solid #dedede; box-shadow: 0 1px 4px rgba(0,0,0,.1); border-radius: 3px;" bgcolor="#fff">
                                    <tr>
                                        <td align="center" valign="top">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" id="template_header" style='background-color: #feede7; color: #0000; border-bottom: 0; font-weight: bold; line-height: 100%; vertical-align: middle; font-family: "Helvetica Neue",Helvetica,Roboto,Arial,sans-serif; border-radius: 3px 3px 0 0;' bgcolor="#7f54b3">
                                                <tr>
                                                    <td id="header_wrapper" style="padding: 36px 48px; display: block;">
                                                        <h1 style='font-family: "Helvetica Neue",Helvetica,Roboto,Arial,sans-serif; font-size: 30px; font-weight: 300; line-height: 150%; margin: 0; text-align: left; text-shadow: 0 1px 0 #0000; color: black;'>Confirmation de Réservation</h1>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" valign="top">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" id="template_body">
                                                <tr>
                                                    <td valign="top" id="body_content" style="background-color: #fff;" bgcolor="#fff">
                                                        <table border="0" cellpadding="20" cellspacing="0" width="100%">
                                                            <tr>
                                                                <td valign="top" style="padding: 48px 48px 32px;">
                                                                    <div id="body_content_inner" style='color: #636363; font-family: "Helvetica Neue",Helvetica,Roboto,Arial,sans-serif; font-size: 14px; line-height: 150%; text-align: left;' align="left">
                                                                        <p style="margin: 0 0 16px;">Bonjour {{ $booking['firstName'] }} {{ $booking['lastName'] }},</p>
                                                                        <h2 style='color: black; display: block; font-family: "Helvetica Neue",Helvetica,Roboto,Arial,sans-serif; font-size: 18px; font-weight: bold; line-height: 130%; margin: 0 0 18px; text-align: left;'>
                                                                            Réservation du {{ \Carbon\Carbon::parse($booking['date'])->format('d/m/Y') }}
                                                                        </h2>
                                                                        <div style="margin-bottom: 40px;">
                                                                            <table class="td" cellspacing="0" cellpadding="6" border="1" style="color: #636363; border: 1px solid #e5e5e5; vertical-align: middle; width: 100%; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;" width="100%">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th class="td" scope="col" style="color: #636363; border: 1px solid #e5e5e5; vertical-align: middle; padding: 12px; text-align: left;" align="left">Détails</th>
                                                                                        <th class="td" scope="col" style="color: #636363; border: 1px solid #e5e5e5; vertical-align: middle; padding: 12px; text-align: left;" align="left">Quantité</th>
                                                                                        <th class="td" scope="col" style="color: #636363; border: 1px solid #e5e5e5; vertical-align: middle; padding: 12px; text-align: left;" align="left">Prix</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    <tr class="order_item">
                                                                                        <td class="td" style="color: #636363; border: 1px solid #e5e5e5; padding: 12px; text-align: left; vertical-align: middle; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif; word-wrap: break-word;" align="left">
                                                                                            Adultes
                                                                                        </td>
                                                                                        <td class="td" style="color: #636363; border: 1px solid #e5e5e5; padding: 12px; text-align: left; vertical-align: middle; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;" align="left">
                                                                                            {{ $booking['adults'] }} x {{ $booking['total_price'] / ($booking['adults'] + $booking['children']) }} MAD
                                                                                        </td>
                                                                                        <td class="td" style="color: #636363; border: 1px solid #e5e5e5; padding: 12px; text-align: left; vertical-align: middle; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;" align="left">
                                                                                            {{ $booking['adults'] * ($booking['total_price'] / ($booking['adults'] + $booking['children'])) }} MAD
                                                                                        </td>
                                                                                    </tr>
                                                                                    @if($booking['children'] > 0)
                                                                                    <tr class="order_item">
                                                                                        <td class="td" style="color: #636363; border: 1px solid #e5e5e5; padding: 12px; text-align: left; vertical-align: middle; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif; word-wrap: break-word;" align="left">
                                                                                            Enfants
                                                                                        </td>
                                                                                        <td class="td" style="color: #636363; border: 1px solid #e5e5e5; padding: 12px; text-align: left; vertical-align: middle; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;" align="left">
                                                                                            {{ $booking['children'] }} x {{ $booking['total_price'] / ($booking['adults'] + $booking['children']) }} MAD
                                                                                        </td>
                                                                                        <td class="td" style="color: #636363; border: 1px solid #e5e5e5; padding: 12px; text-align: left; vertical-align: middle; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;" align="left">
                                                                                            {{ $booking['children'] * ($booking['total_price'] / ($booking['adults'] + $booking['children'])) }} MAD
                                                                                        </td>
                                                                                    </tr>
                                                                                    @endif
                                                                                </tbody>
                                                                                <tfoot>
                                                                                    <tr>
                                                                                        <th class="td" scope="row" colspan="2" style="color: #636363; border: 1px solid #e5e5e5; vertical-align: middle; padding: 12px; text-align: left;" align="left">Total :</th>
                                                                                        <td class="td" style="color: #636363; border: 1px solid #e5e5e5; vertical-align: middle; padding: 12px; text-align: left;" align="left">{{ $booking['total_price'] }} MAD</td>
                                                                                    </tr>
                                                                                </tfoot>
                                                                            </table>
                                                                        </div>
                                                                        <table id="addresses" cellspacing="0" cellpadding="0" border="0" style="width: 100%; vertical-align: top; margin-bottom: 40px; padding: 0;" width="100%">
                                                                            <tr>
                                                                                <td valign="top" width="50%" style="text-align: left; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif; border: 0; padding: 0;" align="left">
                                                                                    <h2 style='color: black; display: block; font-family: "Helvetica Neue",Helvetica,Roboto,Arial,sans-serif; font-size: 18px; font-weight: bold; line-height: 130%; margin: 0 0 18px; text-align: left;'>Détails de la réservation</h2>
                                                                                    <address class="address" style="padding: 12px; color: #636363; border: 1px solid #e5e5e5;">
                                                                                        Client: {{ $booking['firstName'] }} {{ $booking['lastName'] }}<br>
                                                                                        Email: {{ $booking['email'] }}<br>
                                                                                        Téléphone: {{ $booking['phone'] }}<br>
                                                                                        Activité: {{ $booking['activity_title'] ?? 'N/A' }}<br>
                                                                                        Date: {{ $booking['date'] }}<br>
                                                                                        Transfert: {{ $booking['withTransfer'] ? 'Inclus' : 'Non inclus' }}<br>
                                                                                        Statut: En attente
                                                                                    </address>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                        <p style="margin: 0 0 16px;">Pour toute question, n'hésitez pas à nous contacter :</p>
                                                                        <p style="margin: 0 0 16px;">
                                                                            +212 626 851596 / +212 710 987189<br>
                                                                            contact@mymarrakechagency.com
                                                                        </p>
                                                                        <p style="margin: 0 0 16px;">Merci d'avoir choisi My Marrakech Agency !</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" valign="top">
                                <table border="0" cellpadding="10" cellspacing="0" width="100%" id="template_footer">
                                    <tr>
                                        <td valign="top" style="padding: 0; border-radius: 6px;">
                                            <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                                <tr>
                                                    <td colspan="2" valign="middle" id="credit" style='border-radius: 6px; border: 0; color: #8a8a8a; font-family: "Helvetica Neue",Helvetica,Roboto,Arial,sans-serif; font-size: 12px; line-height: 150%; text-align: center; padding: 24px 0;' align="center">
                                                        <p style="margin: 0 0 16px;">mymarrakechagency.com — Votre guide pour Marrakech</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </td>
            <td></td>
        </tr>
    </table>
</body>
</html>