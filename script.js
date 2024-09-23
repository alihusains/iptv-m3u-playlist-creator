let channels = [];

function updateChannelInfo() {
    const channelInfo = document.getElementById('channel_info');
    channelInfo.value = '';
    for (let i = channels.length - 1; i >= 0; i--) {
        const channel = channels[i];
        let info = `Channel Name: ${channel.channel_name}\n` +
                   `Channel Link: ${channel.channel_link}\n`;
        if (channel.group_title) info += `Group Title: ${channel.group_title}\n`;
        if (channel.tvg_id) info += `Tvg ID: ${channel.tvg_id}\n`;
        if (channel.tvg_name) info += `Tvg Name: ${channel.tvg_name}\n`;
        if (channel.tvg_shift) info += `Tvg shift: ${channel.tvg_shift}\n`;
        if (channel.logo_link) info += `Logo Link: ${channel.logo_link}\n`;
        if (channel.license_type) info += `License Type: ${channel.license_type}\n`;
        if (channel.license_key) info += `License Key: ${channel.license_key}\n`;
        if (channel.manifest_type) info += `Manifest Type: ${channel.manifest_type}\n`;
        info += '\n';
        channelInfo.value += info;
    }
    document.getElementById('channel_count').innerText = `Channels Added: ${channels.length}`;
}

function onAddChannel() {
    const channel_name = document.getElementById('channel_name').value.trim();
    const group_title = document.getElementById('group_title').value.trim();
    const channel_link = document.getElementById('channel_link').value.trim();
    const license_type = document.getElementById('license_type').value;
    const license_key = document.getElementById('license_key').value.trim();

    if (!channel_name || !group_title || !channel_link) {
        alert("Required fields: Channel name, Group title, Channel link");
        return;
    }

    if (license_type && !license_key) {
        alert("Enter License key");
        return;
    }

    const channel = {
        channel_name: channel_name,
        channel_link: channel_link,
        group_title: group_title,
        tvg_id: document.getElementById('tvg_id').value.trim(),
        tvg_name: document.getElementById('tvg_name').value.trim(),
        tvg_shift: document.getElementById('tvg_shift').value,
        logo_link: document.getElementById('logo_link').value.trim(),
        license_type: license_type,
        license_key: license_key,
        manifest_type: document.getElementById('manifest_type').value,
    };
    channels.push(channel);
    updateChannelInfo();
    clearEntries();
}

function onClearFields() {
    clearEntries();
}

function onGenerateM3U() {
    if (channels.length === 0) {
        alert("No channels to generate.");
        return;
    }

    let m3uContent = '#EXTM3U\n';
    channels.forEach(channel => {
        if (channel.license_type && channel.license_key) {
            m3uContent += '#KODIPROP:inputstream.adaptive\n';
            m3uContent += `#KODIPROP:inputstream.adaptive.license_type=${channel.license_type}\n`;
            m3uContent += `#KODIPROP:inputstream.adaptive.license_key=${channel.license_key}\n`;
        }
        if (channel.manifest_type) {
            m3uContent += `#KODIPROP:inputstream.adaptive.manifest_type=${channel.manifest_type}\n`;
        }

        let entryInfo = '#EXTINF:-1 ';
        if (channel.tvg_id) entryInfo += `tvg-id="${channel.tvg_id}" `;
        if (channel.tvg_name) entryInfo += `tvg-name="${channel.tvg_name}" `;
        if (channel.tvg_shift) entryInfo += `tvg-shift="${channel.tvg_shift}" `;
        if (channel.logo_link) entryInfo += `tvg-logo="${channel.logo_link}" `;
        if (channel.group_title) entryInfo += `group-title="${channel.group_title}",`;
        entryInfo += `${channel.channel_name}\n`;

        m3uContent += entryInfo;
        m3uContent += `${channel.channel_link}\n`;
    });

    const blob = new Blob([m3uContent], { type: 'text/plain;charset=utf-8' });
    const filename = 'playlist.m3u';

    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    } else {
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}

function clearEntries() {
    document.getElementById('channel_name').value = '';
    document.getElementById('group_title').value = '';
    document.getElementById('tvg_name').value = '';
    document.getElementById('tvg_shift').value = '';
    document.getElementById('tvg_id').value = '';
    document.getElementById('logo_link').value = '';
    document.getElementById('channel_link').value = '';
    document.getElementById('license_type').value = '';
    document.getElementById('license_key').value = '';
    document.getElementById('manifest_type').value = '';
}

function openURL(url) {
    window.open(url, '_blank');
}

document.getElementById('add_channel').addEventListener('click', onAddChannel);
document.getElementById('clear_fields').addEventListener('click', onClearFields);
document.getElementById('generate_m3u').addEventListener('click', onGenerateM3U);
document.getElementById('buy_coffee').addEventListener('click', () => openURL('https://www.buymeacoffee.com/aburshrsh9z'));
document.getElementById('check_updates').addEventListener('click', () => openURL('https://github.com/imrsaleh/Easy-M3U-Playlist-Creator'));
