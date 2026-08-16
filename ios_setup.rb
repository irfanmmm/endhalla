require 'xcodeproj'

project_path = 'ios/Endhalla.xcodeproj'
project = Xcodeproj::Project.open(project_path)

def duplicate_config(project, original_name, new_name, suffix)
  # Check if it already exists
  return if project.build_configurations.find { |c| c.name == new_name }

  original_config = project.build_configurations.find { |c| c.name == original_name }
  new_config = project.new(Xcodeproj::Project::Object::XCBuildConfiguration)
  new_config.name = new_name
  new_config.build_settings = original_config.build_settings.clone
  
  project.build_configuration_list.build_configurations << new_config

  project.targets.each do |target|
    target_original_config = target.build_configurations.find { |c| c.name == original_name }
    if target_original_config
      target_new_config = project.new(Xcodeproj::Project::Object::XCBuildConfiguration)
      target_new_config.name = new_name
      target_new_config.build_settings = target_original_config.build_settings.clone
      target_new_config.base_configuration_reference = target_original_config.base_configuration_reference
      
      if suffix && !suffix.empty?
        bundle_id = target_new_config.build_settings['PRODUCT_BUNDLE_IDENTIFIER']
        if bundle_id && !bundle_id.end_with?(suffix)
            target_new_config.build_settings['PRODUCT_BUNDLE_IDENTIFIER'] = "#{bundle_id}#{suffix}"
        end
      end
      
      target.build_configuration_list.build_configurations << target_new_config
    end
  end
end

puts "Duplicating configurations..."
duplicate_config(project, 'Debug', 'testingDebug', '.testing')
duplicate_config(project, 'Release', 'testingRelease', '.testing')
duplicate_config(project, 'Debug', 'prodDebug', '')
duplicate_config(project, 'Release', 'prodRelease', '')

puts "Adding react-native-config build phase..."
main_target = project.targets.find { |t| t.name == 'Endhalla' }
if main_target
  existing = main_target.shell_script_build_phases.find { |p| p.name == 'Inject react-native-config' }
  unless existing
    phase = project.new(Xcodeproj::Project::Object::PBXShellScriptBuildPhase)
    phase.name = 'Inject react-native-config'
    phase.shell_script = '"${PODS_ROOT}/../node_modules/react-native-config/ios/ReactNativeConfig/BuildDotenvConfig.ruby"'
    # Insert it right after "[CP] Check Pods Manifest.lock" which is usually index 0
    main_target.build_phases.insert(1, phase)
  end
end

project.save
puts "Successfully configured Xcode project."
