Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const appointment = await req.json();
        
        const ghlWebhookUrl = Deno.env.get('GHL_WEBHOOK_URL');
        
        if (!ghlWebhookUrl) {
            console.log('GHL webhook URL not configured, skipping sync');
            return new Response(JSON.stringify({ 
                success: true, 
                message: 'Webhook URL not configured' 
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Format data for GoHighLevel
        const ghlPayload = {
            contact: {
                firstName: appointment.customer_name?.split(' ')[0] || '',
                lastName: appointment.customer_name?.split(' ').slice(1).join(' ') || '',
                email: appointment.customer_email,
                phone: appointment.customer_phone,
            },
            appointment: {
                title: `Reparacion - ${appointment.service_name || 'Servicio'}`,
                startTime: appointment.scheduled_date,
                notes: `Dispositivo: ${appointment.device_info || 'N/A'}\nNotas: ${appointment.notes || 'Sin notas'}`,
            },
            source: 'Telecom La Roca Website'
        };

        // Send to GHL
        const ghlResponse = await fetch(ghlWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ghlPayload)
        });

        const synced = ghlResponse.ok;

        // Update appointment sync status
        if (appointment.id) {
            const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
            const supabaseUrl = Deno.env.get('SUPABASE_URL');

            await fetch(`${supabaseUrl}/rest/v1/appointments?id=eq.${appointment.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey!,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ghl_synced: synced })
            });
        }

        return new Response(JSON.stringify({ 
            success: true, 
            synced 
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            error: { message: error.message }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
