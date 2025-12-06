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
        const { amount, currency = 'usd', cartItems, customerEmail, shippingAddress } = await req.json();

        if (!amount || amount <= 0) {
            throw new Error('Monto valido requerido');
        }

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            throw new Error('Items del carrito requeridos');
        }

        const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!stripeSecretKey) {
            throw new Error('Stripe no configurado');
        }

        // Create payment intent with Stripe
        const stripeParams = new URLSearchParams();
        stripeParams.append('amount', Math.round(amount * 100).toString());
        stripeParams.append('currency', currency);
        stripeParams.append('payment_method_types[]', 'card');
        stripeParams.append('metadata[customer_email]', customerEmail || '');
        stripeParams.append('metadata[cart_items_count]', cartItems.length.toString());

        const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${stripeSecretKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: stripeParams.toString()
        });

        if (!stripeResponse.ok) {
            const errorData = await stripeResponse.text();
            throw new Error(`Error de Stripe: ${errorData}`);
        }

        const paymentIntent = await stripeResponse.json();

        // Create order in database
        const orderData = {
            stripe_payment_intent_id: paymentIntent.id,
            status: 'pending',
            total_amount: amount,
            customer_email: customerEmail || null,
            shipping_address: shippingAddress || null,
            items: cartItems,
            created_at: new Date().toISOString()
        };

        const orderResponse = await fetch(`${supabaseUrl}/rest/v1/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey!,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(orderData)
        });

        if (!orderResponse.ok) {
            throw new Error('Error al crear orden');
        }

        const order = await orderResponse.json();

        return new Response(JSON.stringify({
            data: {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                orderId: order[0]?.id,
                amount: amount
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            error: { code: 'PAYMENT_FAILED', message: error.message }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
